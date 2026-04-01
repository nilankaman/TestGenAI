package com.testgen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String type;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "code_snippet", columnDefinition = "text")
    private String codeSnippet;

    @Column(name = "method_name")
    private String methodName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generation_request_id")
    @JsonIgnore
    private GenerationRequest generationRequest;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public TestCase() {}

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String v) { this.title = v; }
    public String getType() { return type; }
    public void setType(String v) { this.type = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String v) { this.codeSnippet = v; }
    public String getMethodName() { return methodName; }
    public void setMethodName(String v) { this.methodName = v; }
    public GenerationRequest getGenerationRequest() { return generationRequest; }
    public void setGenerationRequest(GenerationRequest v) { this.generationRequest = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
