package com.testgen.service;

import com.testgen.ai.AiProvider;
import com.testgen.ai.PromptBuilder;
import com.testgen.ai.ResponseParser;
import com.testgen.dto.req.GenerateRequest;
import com.testgen.dto.res.GenerateResponse;
import com.testgen.model.GenerationRequest;
import com.testgen.model.TestCase;
import com.testgen.repository.GenerationRequestRepository;
import com.testgen.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class TestGenerationService 
{

    private final AiProvider aiProvider;
    private final PromptBuilder promptBuilder;
    private final ResponseParser responseParser;
    private final GenerationRequestRepository generationRequestRepository;
    private final TestCaseRepository testCaseRepository;

    @Transactional
    public GenerateResponse generate(GenerateRequest request) {

        GenerationRequest record = createInitialRecord(request);

        try {
            log.info("Starting test generation for requestId={}", record.getId());

            String systemPrompt = promptBuilder.systemPrompt();
            String userPrompt = buildUserPrompt(request);

            String rawResponse = aiProvider.generate(systemPrompt, userPrompt);

            ResponseParser.ParsedResponse parsed = responseParser.parse(rawResponse);

            List<TestCase> savedTestCases = saveTestCases(parsed, record);

            markAsCompleted(record, parsed.tokensUsed);

            return buildResponse(record, savedTestCases, parsed);

        } catch (Exception ex) {
            log.error("Test generation failed for requestId={}", record.getId(), ex);
            markAsFailed(record);
            throw ex;
        }
    }

    public Page<GenerationRequest> getHistory(int page, int size) 
    {
        return generationRequestRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    private GenerationRequest createInitialRecord(GenerateRequest request) 
    {
        GenerationRequest record = new GenerationRequest();
        record.setFeatureDescription(request.getFeatureDescription());
        record.setFramework(request.getFramework());
        record.setOutputFormat(request.getOutputFormat());
        record.setCoverageType(request.getCoverageType());
        record.setUiLanguage(request.getUiLanguage());
        record.setStatus("PROCESSING");

        if (isValidUuid(request.getProjectId())) {
            record.setProjectId(UUID.fromString(request.getProjectId()));
        }

        return generationRequestRepository.save(record);
    }

    private String buildUserPrompt(GenerateRequest request) 
    {
        return promptBuilder.userPrompt(
                request.getFeatureDescription(),
                request.getFramework(),
                request.getCoverageType(),
                request.getOutputFormat(),
                request.getUiLanguage()
        );
    }

    private List<TestCase> saveTestCases(ResponseParser.ParsedResponse parsed, GenerationRequest record) 
    {
        return parsed.testCases.stream()
                .map(tc -> 
                    {
                    TestCase entity = new TestCase();
                    entity.setTitle(tc.title);
                    entity.setType(tc.type);
                    entity.setDescription(tc.description);
                    entity.setMethodName(tc.methodName);
                    entity.setCodeSnippet(tc.codeSnippet);
                    entity.setGenerationRequest(record);
                    return testCaseRepository.save(entity);
                })
                .toList();
    }

    private void markAsCompleted(GenerationRequest record, Integer tokensUsed) 
    {
        record.setStatus("COMPLETED");
        record.setCompletedAt(LocalDateTime.now());
        record.setTokensUsed(tokensUsed != null ? tokensUsed : 0);
        generationRequestRepository.save(record);

        log.info("Test generation completed for requestId={}", record.getId());
    }

    private void markAsFailed(GenerationRequest record) 
    {
        record.setStatus("FAILED");
        generationRequestRepository.save(record);
    }

    private boolean isValidUuid(String value) 
    {
        if (value == null || value.isBlank()) return false;
        try {
            UUID.fromString(value);
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private GenerateResponse buildResponse(
            GenerationRequest record,
            List<TestCase> testCases,
            ResponseParser.ParsedResponse parsed
    ) {
        GenerateResponse response = new GenerateResponse();
        response.setRequestId(record.getId());
        response.setFramework(record.getFramework());
        response.setGeneratedAt(record.getCompletedAt() != null ? record.getCompletedAt().toString() : null);
        response.setCoverageScore(parsed.coverageScore);
        response.setTokensUsed(parsed.tokensUsed);

        response.setTestCases(
                testCases.stream()
                        .map(tc -> 
                            {
                            GenerateResponse.TestCaseDTO dto = new GenerateResponse.TestCaseDTO();
                            dto.setId(tc.getId());
                            dto.setTitle(tc.getTitle());
                            dto.setType(tc.getType());
                            dto.setDescription(tc.getDescription());
                            dto.setMethodName(tc.getMethodName());
                            dto.setCodeSnippet(tc.getCodeSnippet());
                            return dto;
                        })
                        .toList()
        );

        response.setSuggestions(
                parsed.suggestions.stream()
                        .map(s -> 
                            {
                            GenerateResponse.SuggestionDTO dto = new GenerateResponse.SuggestionDTO();
                            dto.setTitle(s.title);
                            dto.setDescription(s.description);
                            dto.setIconType(s.iconType);
                            return dto;
                        })
                        .toList()
        );

        return response;
    }
}