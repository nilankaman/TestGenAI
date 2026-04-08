package com.testgen.integration;

import com.testgen.entity.User;
import com.testgen.config.JwtUtil;
import com.testgen.repository.UserRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class GenerateApiTest {

    @LocalServerPort
    private int port;

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    private String authToken;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        userRepository.deleteAll();

        User user = new User();
        user.setEmail("apitest@example.com");
        user.setName("API Test User");
        user.setPasswordHash(passwordEncoder.encode("testpass123"));
        user.setPlan("free");
        userRepository.save(user);

        authToken = jwtUtil.generate(user.getId(), user.getEmail());
    }

    @Test
    @DisplayName("Login with correct credentials returns a token")
    void login_correctCredentials_returnsToken() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                  "email": "apitest@example.com",
                  "password": "testpass123"
                }
                """)
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(200)
            .body("token", not(emptyString()))
            .body("user.email", equalTo("apitest@example.com"));
    }

    @Test
    @DisplayName("Login with wrong password returns 401")
    void login_wrongPassword_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                  "email": "apitest@example.com",
                  "password": "wrongpassword"
                }
                """)
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("Generate with valid request and token returns test cases")
    void generate_validRequest_returnsTestCases() {
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + authToken)
            .body("""
                {
                  "featureDescription": "User login with email and password",
                  "framework": "junit5",
                  "coverageType": "ALL",
                  "outputFormat": "CODE",
                  "uiLanguage": "en"
                }
                """)
        .when()
            .post("/api/v1/generate")
        .then()
            .statusCode(200)
            .body("requestId", notNullValue())
        .body("framework", equalTo("junit5"))
        .body("testCases", notNullValue())
        .body("testCases", instanceOf(java.util.List.class));
    }

    @Test
    @DisplayName("Generate without token returns 401")
    void generate_noToken_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                  "featureDescription": "login feature",
                  "framework": "junit5",
                  "coverageType": "ALL",
                  "outputFormat": "CODE"
                }
                """)
        .when()
            .post("/api/v1/generate")
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("Generate with empty description returns 400")
    void generate_emptyDescription_returns400() {
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + authToken)
            .body("""
                {
                  "featureDescription": "",
                  "framework": "junit5",
                  "coverageType": "ALL",
                  "outputFormat": "CODE"
                }
                """)
        .when()
            .post("/api/v1/generate")
        .then()
            .statusCode(400)
            .body("message", equalTo("Feature description required"));
    }

    @Test
    @DisplayName("History endpoint returns paginated response with content field")
    void generateHistory_authenticated_returnsPaginatedContent() {
  
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/v1/generate/history")
        .then()
            .statusCode(200)
            .body("content", instanceOf(java.util.List.class))
            .body("totalElements", notNullValue());
    }

    @Test
    @DisplayName("Health check returns UP")
    void health_returnsUp() {
        given()
        .when()
            .get("/api/health")
        .then()
            .statusCode(200)
            .body("status", equalTo("UP"));
    }
}