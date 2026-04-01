package com.testgen.quality;

import com.testgen.ai.ResponseParser.TestCaseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QualityEngine {

    private static final Logger log = LoggerFactory.getLogger(QualityEngine.class);

    @Autowired
    private List<QualityRule> rules;

    public QualityReport evaluate(List<TestCaseDTO> cases) {
        List<QualityResult> results = new ArrayList<>();
        int totalPenalty = 0;

        log.info("Starting quality evaluation for {} test cases using {} rules.", cases.size(), rules.size());

        for (QualityRule rule : rules) {
            QualityResult result = rule.evaluate(cases);
            results.add(result);

            if (!result.passed()) {
                totalPenalty += result.penalty();
                log.warn("Rule [{}] failed: {} (-{} points)", 
                         result.ruleName(), result.message(), result.penalty());
            }
        }

        int finalScore = Math.max(0, 100 - totalPenalty);
        return new QualityReport(finalScore, results);
    }

    public interface QualityRule {
        QualityResult evaluate(List<TestCaseDTO> cases);

		boolean evaluate(String code);
    }

    public record QualityResult(
        String ruleName, 
        boolean passed, 
        String message, 
        int penalty
    ) {}

    public record QualityReport(
        int score, 
        List<QualityResult> findings
    ) {

        public boolean isExcellent() { return score >= 90; }
    }
}