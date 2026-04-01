package com.testgen.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.testgen.exception.AiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenAiProvider.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${openai.api.key:}") 
    private String apiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    @Override
    public String name() 
    {
        return "OpenAI";
    }

    @Override
    public String generate(String systemPrompt, String userPrompt) {
        validateConfig();

        try {
            var body = Map.of(
                "model", model,
                "messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
                ),
                "temperature", 0.7,
                "response_format", Map.of("type", "json_object")
            );

            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            var entity = new HttpEntity<>(body, headers);
            
            log.info("Sending request to OpenAI [{}]...", model);
            var response = restTemplate.postForEntity(API_URL, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return extractContent(response.getBody());
            } 
            
            throw new AiException("OpenAI returned an unexpected status: " + response.getStatusCode());

        } catch (Exception e) {
            log.error("OpenAI communication failure: {}", e.getMessage());
            throw new AiException("AI Provider failed to generate content: " + e.getMessage());
        }
    }

    private String extractContent(String jsonResponse) throws Exception {
        JsonNode root = mapper.readTree(jsonResponse);
        String content = root.path("choices").get(0).path("message").path("content").asText();
        
        if (content == null || content.isBlank()) {
            throw new AiException("OpenAI returned an empty content block");
        }
        return content;
    }

    private void validateConfig() {
        if (apiKey == null || apiKey.isBlank()) {
            log.error("OpenAI API key is missing from application properties!");
            throw new AiException("OpenAI configuration error: API key missing.");
        }
    }
}