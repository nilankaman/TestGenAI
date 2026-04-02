// Custom commands — reusable shortcuts for common actions

// Login as demo user in one command
Cypress.Commands.add("loginAsDemo", () => {
  cy.visit("/login");
  cy.contains("button", "Try demo").click();
  cy.url().should("include", "/home");
});

// Login as admin in one command
Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("/login");
  cy.contains("button", "Admin login").click();
  cy.url().should("include", "/home");
});

// Go to generate page and fill in the description
Cypress.Commands.add("fillGenerateForm", (description) => {
  cy.visit("/generate");
  cy.get("textarea").first().clear().type(description);
});
