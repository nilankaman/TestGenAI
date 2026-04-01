package com.testgen.cache;

import com.testgen.ai.AiProvider;
import com.testgen.ai.PromptBuilder;
import com.testgen.ai.ResponseParser;
import com.testgen.dto.req.GenerateRequest;
import com.testgen.dto.res.GenerateResponse;
import com.testgen.model.GenerationRequest;
import com.testgen.model.TestCase;
import com.testgen.repository.GenerationRequestRepository;
import com.testgen.repository.TestCaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CacheAwareGenerationService {

    private static final Logger log = LoggerFactory.getLogger(CacheAwareGenerationService.class);

    @Autowired private AiCacheService cache;
    @Autowired private AiProvider ai;
    @Autowired private PromptBuilder promptBuilder;
    @Autowired private ResponseParser parser;
    @Autowired private GenerationRequestRepository requestRepo;
    @Autowired private TestCaseRepository testCaseRepo;

    public GenerateResponse generate(GenerateRequest req)
    {
        String cacheKey = cache.generateKey(
            req.getFeatureDescription(), 
            req.getFramework(), 
            req.getCoverageType()
        );

        return cache.fetch(cacheKey).orElseGet(() -> 
        {
            if (!cache.lock(cacheKey)) {
                log.info("Task locked by another worker. Waiting for result...");
                return cache.waitForResult(cacheKey)
                    .orElseGet(() -> executeFreshGeneration(req, cacheKey));
            }
            try {
                return executeFreshGeneration(req, cacheKey);
            } finally {
                cache.unlock(cacheKey);
            }
        });
    }

    @SuppressWarnings("null")
	@Transactional
    protected GenerateResponse executeFreshGeneration(GenerateRequest req, String cacheKey) {
        log.info("Executing fresh AI generation for: {}", truncate(req.getFeatureDescription()));

        GenerationRequest record = initializeRequestRecord(req);
        requestRepo.save(record);

        try {
            String system = promptBuilder.systemPrompt();
            String user = promptBuilder.userPrompt(
                req.getFeatureDescription(), req.getFramework(),
                req.getCoverageType(), req.getOutputFormat(), req.getUiLanguage()
            );

            String rawAiResponse = ai.generate(system, user);
            ResponseParser.ParsedResponse parsed = parser.parse(rawAiResponse);

            List<TestCase> savedCases = persistTestCases(parsed.getTestCases(), record);

            record.setStatus("COMPLETED");
            record.setCompletedAt(LocalDateTime.now());
            record.setTokensUsed(parsed.getTokensUsed());
            requestRepo.save(record);

            GenerateResponse response = mapToDto(record, savedCases, parsed);
            cache.store(cacheKey, response, req.getFeatureDescription());

            return response;

        } catch (Exception e) {
            log.error("AI Generation failed for request {}: {}", record.getId(), e.getMessage());
            record.setStatus("FAILED");
            requestRepo.save(record);
            throw new RuntimeException("AI generation pipeline failed.", e);
        }
    }

    private GenerationRequest initializeRequestRecord(GenerateRequest req) 
    {
        GenerationRequest record = new GenerationRequest();
        record.setFeatureDescription(req.getFeatureDescription());
        record.setFramework(req.getFramework());
        record.setOutputFormat(req.getOutputFormat());
        record.setCoverageType(req.getCoverageType());
        record.setUiLanguage(req.getUiLanguage());
        record.setStatus("PROCESSING");

        if (req.getProjectId() != null && !req.getProjectId().isBlank()) 
            {
            try 
            { 
                record.setProjectId(UUID.fromString(req.getProjectId())); 
            } catch (IllegalArgumentException e) {
                log.warn("Invalid ProjectID UUID: {}", req.getProjectId());
            }
        }
        return record;
    }

    private List<TestCase> persistTestCases(List<ResponseParser.TestCaseDTO> dtos, GenerationRequest record) 
    {
        return dtos.stream().map(dto -> 
            {
            TestCase entity = new TestCase();
            entity.setTitle(dto.getTitle());
            entity.setType(dto.getType());
            entity.setDescription(dto.getDescription());
            entity.setMethodName(dto.getMethodName());
            entity.setCodeSnippet(dto.getCodeSnippet());
            entity.setGenerationRequest(record);
            return testCaseRepo.save(entity);
        }
    ).collect(Collectors.toList());
    }

    private GenerateResponse mapToDto(GenerationRequest record, List<TestCase> cases, ResponseParser.ParsedResponse parsed) 
    {
        GenerateResponse res = new GenerateResponse();

        res.setRequestId(record.getId());
        res.setFramework(record.getFramework());
        res.setGeneratedAt(record.getCompletedAt().toString());
        res.setCoverageScore(parsed.getCoverageScore());
        res.setTokensUsed(parsed.getTokensUsed());

        res.setTestCases(cases.stream().map(tc -> 
            {
            GenerateResponse.TestCaseDTO dto = new GenerateResponse.TestCaseDTO();
            dto.setId(tc.getId());
            dto.setTitle(tc.getTitle());
            dto.setType(tc.getType());
            dto.setDescription(tc.getDescription());
            dto.setMethodName(tc.getMethodName());
            dto.setCodeSnippet(tc.getCodeSnippet());
            return dto;
        }
    ).collect(Collectors.toList()));

        res.setSuggestions(parsed.getSuggestions().stream().map(s -> 
            {
            GenerateResponse.SuggestionDTO dto = new GenerateResponse.SuggestionDTO();
            dto.setTitle(s.getTitle());
            dto.setDescription(s.getDescription());
            dto.setIconType(s.getIconType());
            return dto;
        }
    ).collect(Collectors.toList()));

        return res;
    }

    private String truncate(String text) 
    {
        if (text == null || text.length() <= 50) return text;
        return text.substring(0, 47) + "...";
    }
}