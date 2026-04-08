package com.testgen.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "my-super-secret-test-key-32-chars-long-minimum");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", 3600000L); // 1 hour
    }

    @Test
    void shouldCreateAndReadTokenCorrectly() {
        String email = "nilank@testgen.ai";
        UUID userId = UUID.randomUUID();

        String token = jwtUtil.generate(userId, email);

        assertNotNull(token);
        assertEquals(email, jwtUtil.extractEmail(token)); 
        assertTrue(jwtUtil.validateToken(token, email)); 
    }
}