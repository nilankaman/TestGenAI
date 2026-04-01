package com.testgen.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.testgen.dto.res.GenerateResponse;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class AiCacheService {

    private static final Logger log = LoggerFactory.getLogger(AiCacheService.class);
    private static final String LOCK_NAMESPACE = "ai:lock:";
    private static final String CACHE_NAMESPACE = "ai:gen:";

    @Autowired private StringRedisTemplate redis;
    @Autowired private ObjectMapper mapper;

    public String generateKey(String description, String framework, String coverage) {
        String input = String.format("%s|%s|%s", 
            normalize(description), 
            normalize(framework), 
            normalize(coverage)
        );
        return CACHE_NAMESPACE + DigestUtils.sha256Hex(input);
    }

    public Optional<GenerateResponse> fetch(String key) {
        try {
            @SuppressWarnings("null")
			String data = redis.opsForValue().get(key);
            if (data == null) return Optional.empty();

            GenerateResponse response = mapper.readValue(data, GenerateResponse.class);
            response.setFromCache(true);
            return Optional.of(response);
        } catch (Exception e) {
            log.error("Cache hit for key {} but failed to deserialize. Purging.", key);
            redis.delete(key);
            return Optional.empty();
        }
    }

    public void store(String key, GenerateResponse response, String description) {
        try {
            int length = (description != null) ? description.length() : 0;
            Duration ttl = (length > 500) ? Duration.ofDays(1) : Duration.ofDays(7);

            String json = mapper.writeValueAsString(response);
            redis.opsForValue().set(key, json, ttl);
        } catch (JsonProcessingException e) {
            log.warn("Serialization failed for key {}. Skip caching.", key);
        }
    }

    public boolean lock(String key) {
        String lockKey = LOCK_NAMESPACE + key;
        Boolean success = redis.opsForValue().setIfAbsent(lockKey, "LOCKED", Duration.ofSeconds(30));
        return Boolean.TRUE.equals(success);
    }

    public void unlock(String key) {
        redis.delete(LOCK_NAMESPACE + key);
    }

    public Optional<GenerateResponse> waitForResult(String key) {
        log.info("Waiting for another worker to finish generating key: {}", key);
        for (int i = 0; i < 20; i++) { 
            try {
                Thread.sleep(1000);
                Optional<GenerateResponse> result = fetch(key);
                if (result.isPresent()) return result;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    private String normalize(String value) {
        return (value == null) ? "" : value.trim().toLowerCase();
    }
}