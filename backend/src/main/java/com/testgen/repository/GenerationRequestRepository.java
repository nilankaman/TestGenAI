package com.testgen.repository;

import com.testgen.model.GenerationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GenerationRequestRepository extends JpaRepository<GenerationRequest, UUID> {
    
    Optional<GenerationRequest> findByJobId(String jobId);

    Page<GenerationRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
}