package com.testgen.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "generation_requests")
@Data // Automatically creates all getters, setters, toString, and equals/hashCode
@Builder // Allows you to create objects using .builder().jobId("abc").build()
@NoArgsConstructor // Required by JPA/Hibernate
@AllArgsConstructor // Required by Lombok @Builder
public class GenerationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "job_id", unique = true)
    private String jobId;

    @Column(name = "feature_description", columnDefinition = "text")
    private String featureDescription;

    private String framework;
    
    @Builder.Default
    private String outputFormat = "CODE";
    
    @Builder.Default
    private String coverageType = "ALL";
    
    @Builder.Default
    private String uiLanguage = "en";
    
    @Builder.Default
    private String status = "PENDING";

    @Builder.Default
    private Integer tokensUsed = 0;
    
    @Builder.Default
    private Integer queueAttempts = 0;

    @Column(name = "error_message", columnDefinition = "text")
    private String errorMessage;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "generationRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TestCase> testCases = new ArrayList<>();
}