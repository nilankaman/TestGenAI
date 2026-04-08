describe("Generate Page E2E Suite", () => {
  
  beforeEach(() => {
    // Custom command for auth to avoid repetitive UI login steps
    cy.loginAsDemo(); 
    cy.visit("/generate");
  });

  /**
   * 1. NAVIGATION & LAYOUT
   */
  it("should display all three generation mode tabs", () => {
    cy.get('[data-testid="tab-manual"]').should("be.visible");
    cy.get('[data-testid="tab-automation"]').should("be.visible");
    cy.get('[data-testid="tab-script"]').should("be.visible");
  });

  it("should default to Manual mode on load", () => {
    cy.get('[data-testid="tab-manual"]')
      .invoke("attr", "class")
      .should("include", "modeTabOn"); // Logic check: active class presence
  });

  /**
   * 2. MODE SWITCHING LOGIC
   */
  it("should toggle framework visibility in Automation mode", () => {
    cy.get('[data-testid="tab-automation"]').click();

    // Target specific framework buttons using data-testids
    cy.get('[data-testid="framework-selenium"]').should("be.visible");
    cy.get('[data-testid="framework-cypress"]').should("be.visible");
    cy.get('[data-testid="framework-playwright"]').should("be.visible");
  });

  it("should populate input when a script hint is selected", () => {
    const hintText = "login with email and password";
    
    cy.get('[data-testid="tab-script"]').click();
    
    // Using a more specific selector for the hint button
    cy.get('[data-testid="script-hint"]').contains(hintText).click();

    cy.get('[data-testid="description-input"]')
      .should("have.value", hintText);
  });

  /**
   * 3. VALIDATION & ERROR HANDLING
   */
  it("should prevent generation when input is empty", () => {
    cy.get('[data-testid="description-input"]').clear();
    cy.get('[data-testid="generate-button"]').click();

    // Check for the error message specifically
    cy.get('[data-testid="validation-error"]')
      .should("be.visible")
      .and("contain", "Please describe the feature first.");
  });

  /**
   * 4. FRAMEWORK SELECTION STATE
   */
  it("should visually highlight the selected framework", () => {
    cy.get('[data-testid="tab-automation"]').click();

    cy.get('[data-testid="framework-cypress"]')
      .click()
      .should("have.class", "fwBtnOn"); // Direct class check
  });

  /**
   * 5. API INTERACTION (STUBBED)
   */
  it("should display results when generation is successful", () => {
    const mockContent = "SUCCESS_MOCK_TEST_CASE";

    // Intercept the API call to eliminate external AI dependency during testing
    cy.intercept("POST", "**/api/v1/generate", {
      statusCode: 200,
      body: {
        testCases: [
          {
            title: "Mock Test",
            description: mockContent,
            type: "POSITIVE"
          }
        ],
        coverageScore: 90
      }
    }).as("generateRequest");

    cy.get('[data-testid="description-input"]')
      .type("User registration flow");

    cy.get('[data-testid="generate-button"]').click();

    // Wait for the specific network request to finish
    cy.wait("@generateRequest");

    // Verify the mock content appears in the result area
    cy.get('[data-testid="results-container"]')
      .should("be.visible")
      .and("contain", mockContent);
  });
});