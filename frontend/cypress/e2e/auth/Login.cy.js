describe("Login Page", () => {

  beforeEach(() => {
    cy.visit("/login");
  });

  it("shows an error if you try to sign in without filling fields", () => {
    cy.contains("button", "Sign in").click();
    cy.contains("Please fill in all fields.").should("be.visible");
  });

  it("navigates to home when clicking the demo button", () => {
    cy.contains("👤 Try demo — no account needed").click();
    cy.url().should("include", "/home");
  });

  it("shows error when backend returns 401", () => {

    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
      body: { message: "Incorrect email or password." }
    });

    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpass");

    cy.contains("button", "Sign in").click();

    cy.contains("Incorrect email or password.").should("be.visible");
  });

  it("logs in successfully when backend returns 200", () => {

    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: { name: "Test User", plan: "free" }
      }
    });

    cy.get('input[type="email"]').type("demo@example.com");
    cy.get('input[type="password"]').type("password123");

    cy.contains("button", "Sign in").click();

    cy.url().should("include", "/home");
  });

});