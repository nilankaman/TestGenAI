package com.testgen.ratelimit;

import com.testgen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
public class UserPlanService {

    @Autowired private UserRepository      userRepo;
    @Autowired private StringRedisTemplate redis;

    public int getDailyLimit(String userId) {
        String key    = "plan:" + userId;
        String cached = redis.opsForValue().get(key);

        if (cached != null) return toLimit(cached);

        String plan = userRepo.findById(UUID.fromString(userId))
            .map(u -> u.getPlan() != null ? u.getPlan() : "free")
            .orElse("free");

        redis.opsForValue().set(key, plan, Duration.ofMinutes(10));
        return toLimit(plan);
    }

    private int toLimit(String plan) {
        return switch (plan.toLowerCase()) {
            case "pro"  -> 100;
            case "team" -> 500;
            default     -> 3;
        };
    }
}