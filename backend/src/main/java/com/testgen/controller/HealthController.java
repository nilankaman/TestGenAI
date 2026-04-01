package com.testgen.controller;

import com.testgen.ai.AiProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final AiProvider ai;

    public HealthController(AiProvider ai) {
        this.ai = ai;
    }

    @GetMapping
    public ResponseEntity<HealthResponse> health() {

        boolean aiAvailable;
        try {
            ai.name(); // simple lightweight check
            aiAvailable = true;
        } catch (Exception ex) {
            aiAvailable = false;
        }

        String status = aiAvailable ? "UP" : "DEGRADED";

        return ResponseEntity.ok(
                new HealthResponse(
                        status,
                        ai.name(),
                        Instant.now().toString()
                )
        );
    }

    private record HealthResponse(
            String status,
            String aiProvider,
            String timestamp
    ) {}
}