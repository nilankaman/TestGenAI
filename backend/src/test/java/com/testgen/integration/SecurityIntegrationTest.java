package com.testgen.integration;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SecurityIntegrationTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @Test
    void whenAccessingProtectedResourceWithoutToken_thenReturns403() {
        given()
            .contentType("application/json")
            .body("{\"featureDescription\": \"Test Login\"}")
        .when()
            .post("/api/generate")
        .then()
            .statusCode(403);
    }
}