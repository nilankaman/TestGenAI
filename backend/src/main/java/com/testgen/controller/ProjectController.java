package com.testgen.controller;

import com.testgen.exception.NotFoundException;
import com.testgen.model.Project;
import com.testgen.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectRepository repository;

    public ProjectController(ProjectRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Project>> list(Authentication authentication) {
        String userId = authentication.getName();
        List<Project> projects = repository.findByUserId(userId);
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {

        String name = body.get("name");

        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Project name is required"));
        }

        String userId = authentication.getName();

        Project project = new Project();
        project.setName(name.trim());
        project.setDescription(body.getOrDefault("description", "").trim());
        project.setUserId(userId);

        Project saved = repository.save(project);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable UUID id,
            Authentication authentication
    ) {

        String userId = authentication.getName();

        Project project = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        if (!project.getUserId().equals(userId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You do not have permission to delete this project"));
        }

        repository.delete(project);

        return ResponseEntity.ok(Map.of("deleted", true));
    }
}