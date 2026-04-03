describe("Register Page", () => {

  beforeEach(() => {
    cy.visit("/register");
  });

  it("shows an error if you try to submit empty form", () => {
    cy.contains("button", "Create account").click();

    cy.contains("Please fill in all fields.")
      .should("be.visible");
  });


  it("shows an error if password is shorter than 6 characters", () => {
    cy.get('input[placeholder="User Name"]').type("Test User");
    cy.get('input[type="email"]').type("testuser@example.com");
    cy.get('input[type="password"]').type("123");

    cy.contains("button", "Create account").click();

    cy.contains("Password must be at least 6 characters.")
      .should("be.visible");
  });


  it("successfully registers and redirects to home", () => {
    const uniqueEmail = `user${Date.now()}@test.com`;

    cy.get('input[placeholder="User Name"]').type("Test User");
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type("password123");

    cy.contains("button", "Create account").click();

    cy.url().should("include", "/home");
  });

});