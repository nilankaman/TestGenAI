package com.testgen.dto.req;

import jakarta.validation.constraints.NotBlank;


public class GenerateRequest {

    @NotBlank(message = "Feature description is required")
    private String featureDescription;
    private String framework = "junit5";
    private String outputFormat = "CODE";
    private String coverageType = "ALL";
    private String uiLanguage = "en";
    private String projectId;


    public GenerateRequest() {
    }


    public String getFeatureDescription() {
        return featureDescription;
    }

    public void setFeatureDescription(String featureDescription) {
        this.featureDescription = featureDescription;
    }

    public String getFramework() {
        return framework;
    }

    public void setFramework(String framework) {
        if (framework != null && !framework.isBlank()) {
            this.framework = framework;
        }
    }

    public String getOutputFormat() {
        return outputFormat;
    }

    public void setOutputFormat(String outputFormat) {
        if (outputFormat != null && !outputFormat.isBlank()) {
            this.outputFormat = outputFormat;
        }
    }

    public String getCoverageType() {
        return coverageType;
    }

    public void setCoverageType(String coverageType) {
        if (coverageType != null && !coverageType.isBlank()) {
            this.coverageType = coverageType;
        }
    }

    public String getUiLanguage() {
        return uiLanguage;
    }

    public void setUiLanguage(String uiLanguage) {
        if (uiLanguage != null && !uiLanguage.isBlank()) {
            this.uiLanguage = uiLanguage;
        }
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
}