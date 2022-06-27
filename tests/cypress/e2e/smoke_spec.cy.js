describe('My first test', () => {
  it('Visit our app', () => {
    cy.visit(Cypress.env('VITE_DEPLOY_BASE_PATH'))
    cy.contains('gureckis')
    cy.contains('Click me').click()
    cy.contains('Click me').click()

    cy.contains("You've clicked the button 2 times.")
  //  expect(true).to.equal(false);
    //cy.visit('https://example.cypress.io')

    // arrange - setup initial app state
    // act - perform the action
    // assert - verify the result

  })
})