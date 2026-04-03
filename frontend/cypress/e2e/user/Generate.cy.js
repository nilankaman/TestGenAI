describe("Generate Page", () => {

  beforeEach(() => {
    cy.loginAsDemo();
    cy.visit("/generate");
  });

  it("shows all three generation modes", () => {
    cy.contains("📋 Manual").should("be.visible");
    cy.contains("⚙️ Automation").should("be.visible");
    cy.contains("📝 Script").should("be.visible");
  });

  it("opens with Manual mode selected by default", () => {
    cy.get('[data-testid="tab-manual"]')
    .invoke("attr", "class")
      .should("include", "modeTabOn");
  });

  it("reveals framework options when switching to Automation", () => {
    cy.get('[data-testid="tab-automation"]').click();

    cy.contains("Selenium").should("be.visible");
    cy.contains("Cypress").should("be.visible");
    cy.contains("Playwright").should("be.visible");
  });

  it("shows example hints when switching to Script mode", () => {
    cy.get('[data-testid="tab-script"]').click();

    cy.contains("login with email and password")
      .should("be.visible");
  });

  it("fills the textarea when a script hint is selected", () => {
    cy.get('[data-testid="tab-script"]').click();
    cy.contains("login with email and password").click();

    cy.get("textarea")
      .first()
      .should("have.value", "login with email and password");
  });

  it("shows validation error if Generate is clicked with empty input", () => {
    cy.get("textarea").first().clear();
    cy.contains("⚡ Generate manual cases").click();

    cy.contains("Please describe the feature first.")
      .should("be.visible");
  });

  it("shows empty state before any generation", () => {
    cy.contains("Results appear here")
      .should("be.visible");
  });

  it("allows selecting a framework in Automation mode", () => {
    cy.get('[data-testid="tab-automation"]').click();

    cy.contains("button", "Cypress")
    .click()
      .invoke("attr", "class")
      .should("include", "fwBtnOn");
  });

  it("successfully generates test cases (mocked backend)", () => {

    cy.intercept("POST", "**/api/v1/generate", 
      {
      statusCode: 200,
      body: {
        content: "Mock generated test cases"
      }
    }).as("generateRequest");

    cy.get('[data-testid="tab-manual"]').click();

    cy.get("textarea")
      .first()
      .clear()
      .type("User login with email and password");

    cy.contains("button", "⚡ Generate manual cases")
    .scrollIntoView()
    .click({ force: true });

    cy.wait("@generateRequest");

    cy.contains("Mock generated test cases")
      .should("be.visible");
  });

});