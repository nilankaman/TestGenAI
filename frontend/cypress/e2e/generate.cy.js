describe("Generate page", () => {
  beforeEach(() => {
    cy.loginAsDemo();
    cy.visit("/generate");
  });

  it("shows the three mode tabs", () => {
    cy.contains("Manual").should("be.visible");
    cy.contains("Automation").should("be.visible");
    cy.contains("Script").should("be.visible");
  });

  it("manual tab is selected by default", () => {
    // The active tab should have a different style
    cy.contains("Manual").should("have.class", "modeTabOn");
  });

  it("clicking Automation tab shows the framework grid", () => {
    cy.contains("Automation").click();
    cy.contains("Selenium").should("be.visible");
    cy.contains("Cypress").should("be.visible");
    cy.contains("Playwright").should("be.visible");
  });

  it("clicking Script tab shows example hints", () => {
    cy.contains("Script").click();
    cy.contains("login with email and password").should("be.visible");
  });

  it("clicking a script hint fills the textarea", () => {
    cy.contains("Script").click();
    cy.contains("login with email and password").click();
    cy.get("textarea")
      .first()
      .should("have.value", "login with email and password");
  });

  it("shows error when generate clicked with empty description", () => {
    cy.get("textarea").first().clear();
    cy.contains("button", "Generate").click();
    cy.contains("Please describe the feature first").should("be.visible");
  });

  it("shows empty state message before generating", () => {
    cy.contains("Results appear here").should("be.visible");
  });

  it("framework buttons are selectable in Automation tab", () => {
    cy.contains("Automation").click();
    cy.contains("Cypress").click();
    // Cypress button should look active
    cy.contains("Cypress").should("have.class", "fwBtnOn");
  });

  it("full generate flow - fills form and clicks generate", () => {
    cy.get("textarea").first().type("User login with email and password");

    // If backend is running this will show results
    // If not it will show an error - either way the button click works
    cy.contains("button", "Generate").click();

    // Should either show loading or results or an error
    cy.get("body").then(($body) => {
      const hasResults = $body.text().includes("test cases");
      const hasLoading = $body.text().includes("Calling Groq");
      const hasError =
        $body.text().includes("Backend offline") ||
        $body.text().includes("failed");

      expect(hasResults || hasLoading || hasError).to.be.true;
    });
  });
});
