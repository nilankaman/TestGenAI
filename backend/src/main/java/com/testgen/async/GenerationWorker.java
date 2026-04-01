package com.testgen.async;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.testgen.cache.CacheAwareGenerationService;
import com.testgen.dto.req.GenerateRequest;
import com.testgen.model.GenerationRequest;
import com.testgen.repository.GenerationRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

@EnableScheduling
@Component
public class GenerationWorker {

    private static final Logger log = LoggerFactory.getLogger(GenerationWorker.class);

    private static final String QUEUE_KEY = "gen:queue";
    private static final String RETRY_KEY = "gen:retry";
    private static final String LOCK_PREFIX = "gen:lock:";

    @Autowired private StringRedisTemplate redis;
    @Autowired private ObjectMapper mapper;
    @Autowired private CacheAwareGenerationService generationService;
    @Autowired private GenerationRequestRepository repo;

    @Scheduled(fixedDelay = 500)
    public void pollAndProcess() {
        String rawData = redis.opsForList().rightPop(QUEUE_KEY, Duration.ofSeconds(1));
        if (rawData == null) return;

        try {
            GenerationJob job = mapper.readValue(rawData, GenerationJob.class);
            executeJob(job);
        } catch (JsonProcessingException e) {
            log.error("Discarding unparseable job: {}", rawData, e);
        }
    }

    @Scheduled(fixedDelay = 10_000)
    public void moveRetriesToQueue() {
        long now = System.currentTimeMillis();
        var readyToRetry = redis.opsForZSet().rangeByScore(RETRY_KEY, 0, now);

        if (readyToRetry != null && !readyToRetry.isEmpty()) {
            log.info("Found {} jobs ready for retry. Re-queueing...", readyToRetry.size());
            readyToRetry.forEach(raw -> {
                redis.opsForZSet().remove(RETRY_KEY, raw);
                redis.opsForList().leftPush(QUEUE_KEY, raw);
            });
        }
    }

    private void executeJob(GenerationJob job) {
        GenerationRequest record = repo.findByJobId(job.jobId()).orElse(null);

        if (record == null) {
            log.warn("Job [{}] ignored: No matching DB record (possibly deleted).", job.jobId());
            return;
        }

        if (!"PENDING".equals(record.getStatus())) {
            log.debug("Job [{}] skipped: Current status is {}", job.jobId(), record.getStatus());
            return;
        }

        String lockKey = LOCK_PREFIX + job.jobId();
        Boolean locked = redis.opsForValue().setIfAbsent(lockKey, "LOCKED", Duration.ofMinutes(5));

        if (!Boolean.TRUE.equals(locked)) return;

        try {
            updateStatus(record, "PROCESSING");

            GenerateRequest apiRequest = mapToApiRequest(job);
            generationService.generate(apiRequest);

            updateStatus(record, "COMPLETED");
            log.info("Successfully completed Job [{}]", job.jobId());

        } catch (Exception e) {
            log.error("Failed to process Job [{}]: {}", job.jobId(), e.getMessage());
            handleFailure(job, record, e);
        } finally {
            redis.delete(lockKey);
        }
    }

    private void handleFailure(GenerationJob job, GenerationRequest record, Exception e) {
        int nextAttempt = record.getQueueAttempts() + 1;
        record.setQueueAttempts(nextAttempt);

        if (nextAttempt < 3) {
            long delay = (long) Math.pow(2, nextAttempt) * 1000;
            updateStatus(record, "PENDING");

            try {
                String rawJob = mapper.writeValueAsString(job);
                redis.opsForZSet().add(RETRY_KEY, rawJob, System.currentTimeMillis() + delay);
            } catch (JsonProcessingException ex) {
                failPermanently(record, "Serialization failure during retry: " + e.getMessage());
            }
        } else {
            failPermanently(record, "Max retries (3) reached: " + e.getMessage());
        }
    }

    private void updateStatus(GenerationRequest record, String status) {
        record.setStatus(status);
        repo.save(record);
    }

    private void failPermanently(GenerationRequest record, String errorMsg) {
        record.setStatus("FAILED");
        record.setErrorMessage(errorMsg);
        repo.save(record);
    }

    private GenerateRequest mapToApiRequest(GenerationJob job) {
        GenerateRequest req = new GenerateRequest();
        req.setFeatureDescription(job.featureDescription());
        req.setFramework(job.framework());
        req.setCoverageType(job.coverageType());
        req.setOutputFormat(job.outputFormat());
        req.setUiLanguage(job.uiLanguage());
        req.setProjectId(job.projectId());
        return req;
    }
    public record GenerationJob(
            String jobId,
            String projectId,
            String featureDescription,
            String framework,
            String coverageType,
            String outputFormat,
            String uiLanguage
    ) {}
}