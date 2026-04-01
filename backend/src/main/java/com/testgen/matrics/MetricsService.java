package com.testgen.matrics;

import io.micrometer.core.instrument.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class MetricsService {

    private final Timer   aiLatency;
    private final Counter totalGenerations;
    private final Counter failedGenerations;
    private final Counter cacheHits;
    private final Counter cacheMisses;
    private final Counter rateLimitHits;

    @Autowired
    public MetricsService(MeterRegistry registry) {
        this.aiLatency = Timer.builder("ai.generation.latency")
            .publishPercentiles(0.5, 0.9, 0.99)
            .sla(Duration.ofMillis(1000), Duration.ofMillis(3000), Duration.ofMillis(8000))
            .register(registry);

        this.totalGenerations  = registry.counter("generation.total");
        this.failedGenerations = registry.counter("generation.errors");
        this.cacheHits         = registry.counter("ai.cache.hits");
        this.cacheMisses       = registry.counter("ai.cache.misses");
        this.rateLimitHits     = registry.counter("rate.limit.exceeded");
    }

    public void recordGeneration()     { totalGenerations.increment(); }
    public void recordError()          { failedGenerations.increment(); }
    public void recordCacheHit()       { cacheHits.increment(); }
    public void recordCacheMiss()      { cacheMisses.increment(); }
    public void recordRateLimit()      { rateLimitHits.increment(); }
    public void recordAiLatency(long ms) { aiLatency.record(ms, TimeUnit.MILLISECONDS); }

    public <T> T timeAiCall(java.util.concurrent.Callable<T> fn) throws Exception {
        return aiLatency.recordCallable(fn);
    }
}