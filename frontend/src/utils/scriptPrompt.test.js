import { describe, it, expect } from "vitest";
import { buildScriptPrompt } from "./scriptPrompt";

describe("buildScriptPrompt", () => {

  it("should include Selenium and the feature text", () => {
    const prompt = buildScriptPrompt("selenium", "user login flow");

    expect(prompt).toMatch(/Selenium/i);
    expect(prompt).toContain("user login flow");
  });

  it("should include Cypress and the feature text", () => {
    const prompt = buildScriptPrompt("cypress", "signup validation");

    expect(prompt).toMatch(/Cypress/i);
    expect(prompt).toContain("signup validation");
  });

  it("should fallback to Selenium if framework is unknown", () => {
    const prompt = buildScriptPrompt("random", "some test");

    expect(prompt).toMatch(/Selenium/i);
  });

});