package com.testgen.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.testgen.exception.AiException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class ResponseParser 
{

    private final ObjectMapper mapper;

    public ResponseParser(ObjectMapper mapper) 
    {
        this.mapper = mapper;
    }

    public ParsedResponse parse(String raw) 
    {
        if (raw == null || raw.isBlank()) 
            {
            throw new AiException("AI response was empty");
        }

        String cleaned = cleanJsonFormatting(raw);

        try {
            JsonNode root = mapper.readTree(cleaned);
            return buildResult(root);
        } catch (Exception e) {
            log.error("Failed to parse AI JSON. Raw start: {}", raw.substring(0, Math.min(raw.length(), 100)));
            throw new AiException("The AI returned malformed JSON that couldn't be parsed.", e);
        }
    }

    private String cleanJsonFormatting(String raw) 
    {
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            int firstNewline = cleaned.indexOf('\n');
            int lastBackticks = cleaned.lastIndexOf("```");
            if (firstNewline != -1 && lastBackticks > firstNewline) {
                cleaned = cleaned.substring(firstNewline, lastBackticks).trim();
            }
        }

        int start = cleaned.indexOf('{');
        int end = cleaned.lastIndexOf('}');
        return (start != -1 && end > start) ? cleaned.substring(start, end + 1) : cleaned;
    }

    private ParsedResponse buildResult(JsonNode root) 
    {
        List<TestCaseDTO> cases = new ArrayList<>();
        JsonNode casesNode = root.path("testCases");
        if (casesNode.isArray()) {
            for (JsonNode c : casesNode) {
                cases.add(TestCaseDTO.builder()
                        .title(c.path("title").asText(""))
                        .type(c.path("type").asText("POSITIVE"))
                        .description(c.path("description").asText(""))
                        .methodName(c.path("methodName").asText(""))
                        .codeSnippet(c.path("codeSnippet").asText(""))
                        .build());
            }
        }

        List<SuggestionDTO> suggestions = new ArrayList<>();
        JsonNode suggestionsNode = root.path("suggestions");
        if (suggestionsNode.isArray()) {
            for (JsonNode s : suggestionsNode) {
                suggestions.add(SuggestionDTO.builder()
                        .title(s.path("title").asText(""))
                        .description(s.path("description").asText(""))
                        .iconType(s.path("iconType").asText("info"))
                        .build());
            }
        }

        return ParsedResponse.builder()
                .testCases(cases)
                .suggestions(suggestions)
                .coverageScore(root.path("coverageScore").asInt(70))
                .tokensUsed(root.path("tokensUsed").asInt(0))
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParsedResponse 
    {
        @Builder.Default
        public List<TestCaseDTO> testCases = new ArrayList<>();
        @Builder.Default
        public List<SuggestionDTO> suggestions = new ArrayList<>();
        public int coverageScore;
        public int tokensUsed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestCaseDTO 
    {
        public String title;
        public String type;
        public String description;
        public String methodName;
        public String codeSnippet;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestionDTO 
    {
        public String title;
        public String description;
        public String iconType;
    }
}