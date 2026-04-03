export function buildScriptPrompt(framework, description) {
  const templates = {
    selenium: `Write a complete Selenium WebDriver test class in Java for: "${description}". Return only Java code.`,
    cypress: `Write a complete Cypress test file in JavaScript for: "${description}". Return only JS code.`,
  };

  return templates[framework] || templates.selenium;
}