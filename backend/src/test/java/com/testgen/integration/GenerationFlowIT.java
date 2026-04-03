package com.testgen.integration;

import com.testgen.ai.AiProvider;
import com.testgen.config.JwtUtil;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SuppressWarnings("unused")
@SpringBootTest
@AutoConfigureMockMvc
public class GenerationFlowIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockBean
    private AiProvider aiProvider;

    @Test
void userShouldBeAbleToGenerateTestCases() throws Exception {
    String token = jwtUtil.generate(java.util.UUID.randomUUID(), "user@test.com");

    Mockito.when(aiProvider.generate(Mockito.anyString(), Mockito.anyString()))
           .thenReturn("{\"testCases\": [], \"coverageScore\": 90}");

    mockMvc.perform(post("/api/v1/generate")
            .header("Authorization", "Bearer " + token)
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .content("{\"featureDescription\": \"Login Page\", \"framework\": \"junit5\"}"))
            .andExpect(status().isOk());
}
}