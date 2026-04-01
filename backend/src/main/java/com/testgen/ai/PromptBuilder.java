package com.testgen.ai;

import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    public String systemPrompt() {
        return """
            You are a senior QA engineer. Generate test cases based on the feature description.
            
            Return the result strictly as a JSON object.
            Do not include explanations or markdown formatting.
            
            Expected JSON structure:
            {
              "testCases": [
                {
                  "title":       "short title under 60 chars",
                  "type":        "POSITIVE" | "NEGATIVE" | "EDGE",
                  "description": "one sentence, what this test checks",
                  "methodName":  "camelCaseMethodName",
                  "codeSnippet": "test code using the chosen framework"
                }
              ],
              "suggestions": [
                {
                  "title":       "suggestion title",
                  "description": "what to improve",
                  "iconType":    "info" | "warn" | "success"
                }
              ],
              "coverageScore": integer between 0 and 100,
              "tokensUsed": integer representing estimated token usage
            }
            
            Rules:
            - type must be exactly POSITIVE, NEGATIVE, or EDGE
            - methodName must be camelCase with no spaces
            - Generate between 3 and 8 test cases depending on complexity
            - Code must use the framework specified by the user
            """;
    }

    public String userPrompt(String feature, String framework, String coverage, String format, String lang) {
        return String.format("""
            Feature: %s
            
            Framework: %s
            Coverage type: %s
            Output format: %s
            Language for descriptions: %s
            
            Generate test cases now.
            """, feature, framework, coverage, format, lang);
    }
}
