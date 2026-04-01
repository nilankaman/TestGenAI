package com.testgen.config;

import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Configuration
public class RedisServerConfig {
    private redis.embedded.RedisServer redisServer;

    @PostConstruct
    public void startRedis() {
        redisServer = new redis.embedded.RedisServer(6379);
        redisServer.start();
    }

    @PreDestroy
    public void stopRedis() {
        if (redisServer != null) {
            redisServer.stop();
        }
    }
}