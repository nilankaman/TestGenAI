package com.testgen.ai;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.ObjectMapper;

class ResponseParserTest {

    private ResponseParser parser;

    @BeforeEach
    void setUp() {
        ObjectMapper mapper = new ObjectMapper();
        parser = new ResponseParser(mapper);       
    }

    @Test
    void testParseValidResponse() {
        String rawJson = "{\"testCases\": [{\"title\": \"Login Test\", \"type\": \"POSITIVE\", \"description\": \"Checks login\"}], \"coverageScore\": 85}";

        ResponseParser.ParsedResponse result = parser.parse(rawJson);

        assertNotNull(result);
        assertEquals(1, result.testCases.size());
        assertEquals("Login Test", result.testCases.get(0).title);
        assertEquals(85, result.coverageScore);
    }

    @Test
    void testParseEmptyResponse() {
        String emptyJson = "{\"testCases\": []}";
        ResponseParser.ParsedResponse result = parser.parse(emptyJson);
        assertTrue(result.testCases.isEmpty());
    }
}