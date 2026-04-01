package com.testgen.ai;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import com.testgen.exception.AiException;
@Primary
@Component
public class ResilientAiProvider implements AiProvider 
{

    private static final Logger log = LoggerFactory.getLogger(ResilientAiProvider.class);

    private final AiProvider    primary;
    private final AiProvider    fallback;
    private final CircuitBreaker cb;

    public ResilientAiProvider(
        @Qualifier("groqProvider")   AiProvider primary,
        @Qualifier("openAiProvider") AiProvider fallback,
        CircuitBreakerRegistry       registry
    ) 
    {
        this.primary  = primary;
        this.fallback = fallback;
        this.cb       = registry.circuitBreaker("groq");
    }

    @Override
    public String generate(String system, String user) 
    {
        var decorated = CircuitBreaker.decorateSupplier(cb, () -> primary.generate(system, user));

        try 
        {
            return decorated.get();
        } catch (Exception e) {
            log.warn("Groq failed (circuit={}), switching to fallback. Reason: {}",
                cb.getState(), e.getMessage());
            try {
                return fallback.generate(system, user);
            } catch (Exception fe) {
                log.error("Both AI providers failed. Groq: {} | OpenAI: {}", e.getMessage(), fe.getMessage());
                throw new AiException("All AI providers are currently unavailable.");
            }
        }
    }

    @Override
    public String name() 
    {
        return switch (cb.getState()) 
        {
            case OPEN      -> fallback.name() + " (Groq circuit open)";
            case HALF_OPEN -> primary.name()  + " (testing recovery)";
            default        -> primary.name();
        };
    }

    public CircuitBreaker.State circuitState() 
    {
        return cb.getState();
    }
}