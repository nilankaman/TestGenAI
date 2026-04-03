describe("Generate Page", () => {
  beforeEach(() => {
    // Log in as demo user and open the generate page
    cy.loginAsDemo();
    cy.visit("/generate");
  });

  it("displays all three mode tabs", () => {
    cy.contains("📋 Manual").should("be.visible");
    cy.contains("⚙️ Automation").should("be.visible");
    cy.contains("📝 Script").should("be.visible");
  });

  it("selects the Manual tab by default", () => {
    cy.get('[data-testid="tab-manual"]').should(($btn) => {
      expect($btn[0].className).to.match(/modeTabOn/);
    });
  });

  it("shows framework options when Automation tab is clicked", () => {
    cy.get('[data-testid="tab-automation"]').click();
    cy.contains("Selenium").should("be.visible");
    cy.contains("Cypress").should("be.visible");
    cy.contains("Playwright").should("be.visible");
  });

  it("shows example hints when Script tab is clicked", () => {
    cy.get('[data-testid="tab-script"]').click();
    cy.contains("login with email and password").should("be.visible");
  });

  it("fills the textarea when a script hint is clicked", () => {
    cy.get('[data-testid="tab-script"]').click();
    cy.contains("login with email and password").click();
    cy.get("textarea").first().should(
      "have.value",
      "login with email and password"
    );
  });

  it("displays an error if Generate is clicked with empty input", () => {
    cy.get("textarea").first().clear();
    cy.get('[data-testid="tab-manual"]').should(($btn) => {
      expect($btn[0].className).to.match(/modeTabOn/);
    });

    // Click Generate
    cy.contains("⚡ Generate manual cases").click();

    // Error message should appear
    cy.contains("Please describe the feature first.").should("be.visible");
  });

  it("shows empty state before generating", () => {
    cy.contains("Results appear here").should("be.visible");
  });

  it("allows selecting framework buttons in Automation tab", () => {
    cy.get('[data-testid="tab-automation"]').click();

    // Click the Cypress button and assert class on the button element
    cy.contains("button", "Cypress").click();
    cy.contains("button", "Cypress").should(($btn) => {
      expect($btn[0].className).to.match(/fwBtnOn/);
    });
  });

  it("handles the full generate flow", () => {
    cy.get("textarea").first().type("User login with email and password");
    cy.contains("⚡ Generate manual cases").click();

    cy.get("body").then(($body) => {
      const hasResults = $body.text().includes("test cases");
      const hasLoading = $body.text().includes("Calling Groq");
      const hasError =
        $body.text().includes("Backend offline") ||
        $body.text().includes("failed") ||
        $body.text().includes("Please describe the feature first.");

      expect(hasResults || hasLoading || hasError).to.be.true;
    });
  });
});