package com.testgen.ai;

public interface AiProvider {
    String generate(String systemPrompt, String userPrompt);

    String name();
}
