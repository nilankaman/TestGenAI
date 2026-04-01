package com.testgen.controller;

import com.testgen.ai.AiProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AiProvider ai;

    public ChatController(AiProvider ai) {
        this.ai = ai;
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        var messages = (List<Map<String, String>>) body.get("messages");

        if (messages == null || messages.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("message", "Messages are required"));

        String lastUserMessage = messages.stream()
            .filter(m -> "user".equals(m.get("role")))
            .reduce((a, b) -> b)
            .map(m -> m.get("content"))
            .orElse("");

        StringBuilder history = new StringBuilder();
        for (int i = 0; i < messages.size() - 1; i++) {
            var m = messages.get(i);
            history.append(m.get("role")).append(": ").append(m.get("content")).append("\n");
        }

        String system = """
            You are a senior QA engineer and SDET expert. You specialize in:
            Selenium, Appium, RestAssured, Cucumber, Playwright, Cypress, JUnit5, TestNG, Pytest, Jest.
            You also know CI/CD pipelines, Jira, and the TestGen AI platform.
            Be helpful, concise, and practical. Give real code examples when asked.
            """ + (history.length() > 0 ? "\nConversation so far:\n" + history : "");

        String reply = ai.generate(system, lastUserMessage);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}
