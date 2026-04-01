package com.testgen.controller;

import com.testgen.dto.req.GenerateRequest;
import com.testgen.service.TestGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/generate")
public class TestGenerationController {

    private final TestGenerationService service;

    public TestGenerationController(TestGenerationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> generate(@RequestBody GenerateRequest request) {

        if (request == null || 
            request.getFeatureDescription() == null || 
            request.getFeatureDescription().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Feature description is required"));
        }

        var response = service.generate(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        if (page < 0) {
            page = 0;
        }

        if (size <= 0 || size > 100) {
            size = 20;
        }

        var history = service.getHistory(page, size);
        return ResponseEntity.ok(history);
    }
}