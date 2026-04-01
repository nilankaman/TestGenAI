package com.testgen.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testgen.config.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Set<String> LIMITED = Set.of("/api/v1/generate", "/api/chat");

    @Autowired private StringRedisTemplate redis;
    @Autowired private JwtUtil             jwtUtil;
    @Autowired private ObjectMapper        mapper;
    @Autowired private UserPlanService     planService;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {

        if (!"POST".equals(req.getMethod()) || !LIMITED.contains(req.getRequestURI())) {
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        String token = header.substring(7);
        if (!jwtUtil.isValid(token)) {
            chain.doFilter(req, res);
            return;
        }

        String userId = jwtUtil.getUserId(token);
        int    limit  = planService.getDailyLimit(userId);
        String key    = "rate:" + userId + ":" + LocalDate.now();

        Long count = redis.opsForValue().increment(key);
        if (count == 1) redis.expire(key, Duration.ofDays(1));

        Long ttl = redis.getExpire(key, TimeUnit.SECONDS);
        res.setHeader("X-RateLimit-Limit",     String.valueOf(limit));
        res.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, limit - count)));
        res.setHeader("X-RateLimit-Reset",
            String.valueOf(System.currentTimeMillis() / 1000 + (ttl != null ? ttl : 86400)));

        if (count > limit) {
            String timeLeft = formatTtl(ttl != null ? ttl : 86400);
            res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
            mapper.writeValue(res.getWriter(), Map.of(
                "message",       "Daily limit of " + limit + " reached. Resets in " + timeLeft,
                "limitExceeded", true,
                "resets",        timeLeft
            ));
            return;
        }

        if (!checkBurst(userId, res)) return;

        chain.doFilter(req, res);
    }

    private boolean checkBurst(String userId, HttpServletResponse res) throws IOException {
        String key   = "burst:" + userId + ":" + (System.currentTimeMillis() / 60000);
        Long   count = redis.opsForValue().increment(key);
        if (count == 1) redis.expire(key, Duration.ofMinutes(2));

        if (count > 10) {
            res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
            mapper.writeValue(res.getWriter(), Map.of(
                "message",    "Too many requests. Max 10 per minute.",
                "retryAfter", 60
            ));
            return false;
        }
        return true;
    }

    private String formatTtl(long seconds) {
        if (seconds > 3600) return (seconds / 3600) + "h " + ((seconds % 3600) / 60) + "m";
        return (seconds / 60) + "m";
    }
}