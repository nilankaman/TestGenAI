package com.testgen.repository;

import com.testgen.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TestCaseRepository extends JpaRepository<TestCase, UUID> {
    List<TestCase> findByGenerationRequestId(UUID requestId);
}
