const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 900,
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
  },
});
