package com.testgen.ai;

import com.testgen.dto.req.GroqChatRequest;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "groq")
public class GroqProvider implements AiProvider {

    private final WebClient webClient;
    private final String model;

    public GroqProvider(WebClient.Builder builder, 
                        @Value("${groq.api.base-url}") String baseUrl,
                        @Value("${groq.api.key}") String apiKey,
                        @Value("${groq.api.model}") String model) {
        this.model = model;
        this.webClient = builder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    @Override
    public String generate(String systemPrompt, String userPrompt) {
        // Professional approach: Build an object instead of manual JSON nodes
        GroqChatRequest request = new GroqChatRequest(
            model,
            List.of(
                new GroqChatRequest.Message("system", systemPrompt),
                new GroqChatRequest.Message("user", userPrompt)
            ),
            0.1, 
            2048
        );

        return webClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> json.path("choices").get(0).path("message").path("content").asText())
                .block(); 
    }

    @Override
    public String name() {
        return "groq";
    }
}