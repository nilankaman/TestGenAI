package com.testgen.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testgen.exception.AiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ResponseParserTest {

    private ResponseParser parser;

    @BeforeEach
    void setup() {
        parser = new ResponseParser(new ObjectMapper());
    }

    @Test
    void shouldParseValidJson() {
        String json = """
        {
          "testCases": [
            {
              "title": "Valid Login",
              "type": "POSITIVE",
              "description": "Login works",
              "methodName": "shouldLogin",
              "codeSnippet": "assertTrue(true);"
            }
          ],
          "suggestions": [
            {
              "title": "Add edge case",
              "description": "Test null input",
              "iconType": "warning"
            }
          ],
          "coverageScore": 80,
          "tokensUsed": 120
        }
        """;

        var result = parser.parse(json);

        assertEquals(1, result.getTestCases().size());
        assertEquals("Valid Login", result.getTestCases().get(0).getTitle());
        assertEquals(80, result.getCoverageScore());
        assertEquals(120, result.getTokensUsed());
    }

    @Test
    void shouldHandleMarkdownWrappedJson() {
        String json = """
        ```json
        {
          "coverageScore": 95
        }
        ```
        """;

        var result = parser.parse(json);
        assertEquals(95, result.getCoverageScore());
    }

    @Test
    void shouldThrowExceptionForNullInput() {
        assertThrows(AiException.class, () -> parser.parse(null));
    }

    @Test
    void shouldThrowExceptionForMalformedJson() {
        String invalid = "{ bad json }";
        assertThrows(AiException.class, () -> parser.parse(invalid));
    }
}