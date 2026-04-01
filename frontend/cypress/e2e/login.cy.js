describe('Login page', () => {

  beforeEach(() => {
    cy.visit('/login')
  })
1
  it('shows the TestGen AI logo and title', () => {
    cy.contains('TestGen AI').should('be.visible')
    cy.contains('Welcome back').should('be.visible')
  })

  it('shows email and password inputs', () => {
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('error', () => {
    cy.contains('button', 'Sign in').click(console.error();
    )
    cy.contains('Please fill in all fields').should('be.visible')
  })

  it('demo login button redirects to home', () => {
    cy.contains('button', 'Try demo').click()
    cy.url().should('include', '/home')
  })

  it('admin login button redirects to home', () => {
    cy.contains('button', 'Admin login').click()
    cy.url().should('include', '/home')
  })

  it('admin login shows the admin badge somewhere on the page', () => {
    cy.contains('button', 'Admin login').click()
    cy.url().should('include', '/home')
  
    cy.contains('Admin').should('exist')
  })

  it('redirects to home if already logged in', () => {
    // Login first via demo
    cy.contains('button', 'Try demo').click()
    cy.url().should('include', '/home')
    // Try going back to login
    cy.visit('/login')
    cy.url().should('include', '/home')
  })

  it('register link goes to register page', () => {
    cy.contains('Create one free').click()
    cy.url().should('include', '/register')
  })

})
