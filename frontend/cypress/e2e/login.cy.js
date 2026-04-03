/// <reference types="cypress" />

describe("Login Page", () => {
  beforeEach(() => {
    // Visit login page before each test
    cy.visit("/login");
  });

  it("shows an error if you try to sign in without filling fields", () => {
    // Click Sign in without typing anything
    cy.contains("button", "Sign in").click();

    // Check for error message
    cy.contains("Please fill in all fields.").should("be.visible");
  });

  it("lets you log in using the demo account", () => {
    // Click demo button
    cy.contains("button", "👤 Try demo — no account needed").click();

    // Check that home page loads
    cy.url({ timeout: 10000 }).should("include", "/home");

    // Check that demo user name appears in the header or navbar
    // You may need to add this span in your React code:
    // <span data-testid="user-name">{user.name}</span>
    cy.get('[data-testid="user-name"]', { timeout: 5000 })
      .should("contain.text", "Demo User");
  });

  it("allows a user to log in with valid credentials", () => {
    // Fill email and password
    cy.get('input[type="email"]').type("demo@example.com");
    cy.get('input[type="password"]').type("password123");

    // Click Sign in
    cy.contains("button", "Sign in").click();

    // Check that home page loads
    cy.url({ timeout: 10000 }).should("include", "/home");

    // Verify user name on home page
    cy.get('[data-testid="user-name"]', { timeout: 5000 })
      .should("contain.text", "demo"); // matches your LoginPage logic
  });

  it("shows an error if you enter wrong credentials", () => {
    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpass");

    cy.contains("button", "Sign in").click();

    // Check error message appears
    cy.get('[data-testid="login-error"]', { timeout: 5000 })
      .should("contain.text", "Incorrect email or password.");
  });
});