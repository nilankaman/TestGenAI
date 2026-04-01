package com.testgen.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.testgen.exception.AiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "groq")
public class GroqProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GroqProvider.class);

    private final WebClient webClient;
    private final ObjectMapper mapper;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.base-url}")
    private String baseUrl;

    @Value("${groq.api.model}")
    private String model;

    @Value("${groq.api.max-tokens:2048}")
    private int maxTokens;

    @Value("${groq.api.temperature:0.3}")
    private double temperature;

    public GroqProvider(WebClient.Builder builder, ObjectMapper mapper) {
        this.webClient = builder.build();
        this.mapper = mapper;
    }

    @SuppressWarnings("null")
	@Override
    public String generate(String systemPrompt, String userPrompt) {
        try {
            ObjectNode body = mapper.createObjectNode();
            body.put("model", model);
            body.put("max_tokens", maxTokens);
            body.put("temperature", temperature);

            ArrayNode messages = body.putArray("messages");
            messages.addObject().put("role", "system").put("content", systemPrompt);
            messages.addObject().put("role", "user").put("content", userPrompt);

            log.debug("Calling Groq model {} with maxTokens={}", model, maxTokens);
            String raw = webClient
                .post()
                .uri(baseUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(60))
                .block();
            if (raw == null || raw.isBlank()) {
                throw new AiException("Empty response received from Groq API");
            }
            JsonNode root = mapper.readTree(raw);
            String content = root.at("/choices/0/message/content").asText(null);

            if (content == null || content.isBlank()) {
            throw new AiException("Groq response did not contain message content");
            }

            return content;

        } catch (WebClientResponseException e) {
            log.error("Groq error {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new AiException(
                "Groq API call failed with status " + e.getStatusCode().value()
            );
        } catch (Exception e) {
            log.error("Groq call failed: {}", e.getMessage());
            throw new AiException("AI call failed: " + e.getMessage());
        }
    }

    @Override
    public String name() {
        return "Groq / " + model;
    }
}