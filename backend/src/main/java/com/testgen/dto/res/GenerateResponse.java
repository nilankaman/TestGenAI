package com.testgen.dto.res;

import java.util.List;
import java.util.UUID;

public class GenerateResponse {

    private UUID requestId;
    private String framework;
    private String generatedAt;
    private Integer coverageScore;
    private Integer tokensUsed;
    private List<TestCaseDTO> testCases;
    private List<SuggestionDTO> suggestions;
    @SuppressWarnings("unused")
	private boolean fromCache;

    public UUID getRequestId() { return requestId; }
    public void setRequestId(UUID requestId) { this.requestId = requestId; }

    public String getFramework() { return framework; }
    public void setFramework(String framework) { this.framework = framework; }

    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }

    public Integer getCoverageScore() { return coverageScore; }
    public void setCoverageScore(Integer coverageScore) { this.coverageScore = coverageScore; }

    public Integer getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(Integer tokensUsed) { this.tokensUsed = tokensUsed; }

    public List<TestCaseDTO> getTestCases() { return testCases; }
    public void setTestCases(List<TestCaseDTO> testCases) { this.testCases = testCases; }

    public List<SuggestionDTO> getSuggestions() { return suggestions; }
    public void setSuggestions(List<SuggestionDTO> suggestions) { this.suggestions = suggestions; }

    public static class TestCaseDTO {
        private UUID id;
        private String title;
        private String type;
        private String description;
        private String methodName;
        private String codeSnippet;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getMethodName() { return methodName; }
        public void setMethodName(String methodName) { this.methodName = methodName; }

        public String getCodeSnippet() { return codeSnippet; }
        public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }
    }

    public static class SuggestionDTO {
        private String title;
        private String description;
        private String iconType;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getIconType() { return iconType; }
        public void setIconType(String iconType) { this.iconType = iconType; }
    }

	public String getTitle() {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'getTitle'");
	}
    public String getDescription() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getDescription'");
    }
    public String getIconType() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getIconType'");
    }
    public void setFromCache(boolean b) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setFromCache'");
    }
}