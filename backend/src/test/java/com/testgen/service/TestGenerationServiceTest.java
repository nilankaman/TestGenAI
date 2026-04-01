package com.testgen.service;

import com.testgen.ai.AiProvider;
import com.testgen.ai.PromptBuilder;
import com.testgen.ai.ResponseParser;
import com.testgen.dto.req.GenerateRequest;
import com.testgen.dto.res.GenerateResponse;
import com.testgen.repository.GenerationRequestRepository;
import com.testgen.repository.TestCaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Test Generation Service Logic")
class TestGenerationServiceTest 
{
    @Mock private AiProvider ai;
    @Mock private PromptBuilder promptBuilder;
    @Mock private ResponseParser parser;
    @Mock private GenerationRequestRepository requestRepo;
    @Mock private TestCaseRepository testCaseRepo;

    @InjectMocks
    private TestGenerationService service;

    private GenerateRequest validRequest;

    @BeforeEach
    void setUp() 
    {
        validRequest = new GenerateRequest(); 
        validRequest.setFeatureDescription("User login with email and password");
        validRequest.setFramework("junit5");
        validRequest.setCoverageType("ALL");
        validRequest.setOutputFormat("CODE");
        validRequest.setUiLanguage("en");
    }

    private void stubSuccessfulPipeline() 
    {
        when(promptBuilder.systemPrompt()).thenReturn("system_prompt");
        when(promptBuilder.userPrompt(anyString(), anyString(), anyString(), anyString(), anyString()))
            .thenReturn("user_prompt");
        when(ai.generate(anyString(), anyString())).thenReturn("raw_json");
        when(parser.parse(anyString())).thenReturn(createMockParsedResponse());
        when(requestRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(testCaseRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    @DisplayName("Should execute the full AI generation pipeline exactly once")
    void shouldExecuteFullPipeline() 
    {
        stubSuccessfulPipeline();
        service.generate(validRequest);
        verify(ai, times(1)).generate(anyString(), anyString());
    }

    @Test
    @DisplayName("Should return a response matching the requested framework")
    void shouldReturnCorrectMetadata() 
    {
        stubSuccessfulPipeline();
        GenerateResponse response = service.generate(validRequest);
        
        assertNotNull(response);
        assertEquals("junit5", response.getFramework());
        assertEquals(82, response.getCoverageScore());
    }

    @ParameterizedTest
    @ValueSource(strings = { "selenium", "cypress", "playwright" })
    @DisplayName("Should handle various frameworks")
    void shouldSupportMultipleFrameworks(String framework) 
    {
        validRequest.setFramework(framework);
        stubSuccessfulPipeline();
        GenerateResponse response = service.generate(validRequest);
        assertEquals(framework, response.getFramework());
    }

    @Test
    @DisplayName("Should handle AI provider failure")
    void shouldHandleAiProviderFailure() 
    {
        when(promptBuilder.systemPrompt()).thenReturn("system");
        when(promptBuilder.userPrompt(anyString(), anyString(), anyString(), anyString(), anyString()))
            .thenReturn("user");
        when(ai.generate(anyString(), anyString())).thenThrow(new RuntimeException("API Timeout"));
        when(requestRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        assertThrows(RuntimeException.class, () -> service.generate(validRequest));
    }

    private ResponseParser.ParsedResponse createMockParsedResponse() 
    {
        ResponseParser.ParsedResponse parsed = new ResponseParser.ParsedResponse();
        List<ResponseParser.TestCaseDTO> testCases = new ArrayList<>();
        
        for (int i = 1; i <= 3; i++) 
            {
            ResponseParser.TestCaseDTO tc = new ResponseParser.TestCaseDTO();
            tc.setTitle("Test Case " + i);
            tc.setType("POSITIVE");
            tc.setDescription("Description " + i);
            tc.setMethodName("testMethod" + i);
            tc.setCodeSnippet("// code");
            testCases.add(tc);
        }

        parsed.setTestCases(testCases);
        parsed.setSuggestions(new ArrayList<>());
        parsed.setCoverageScore(82);
        parsed.setTokensUsed(150);

        return parsed;
    }
}