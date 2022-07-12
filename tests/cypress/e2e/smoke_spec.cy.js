// Tests generally have to form of
// 1. arrange things
// 2. act (e.g., click buttons)
// 3. assert results (e.g., check that the page changed)

// a couple of tips
// if you change any describe to describe.only then it will only run that test group
// within a describe if you change any if to if.only then it will only run that test

describe('user flow', () => {
  beforeEach(() => {
    // interestingly setting the viewport in the before each works better
    cy.viewport(1000, 1200) // cy.viewport('iphone-11)
    cy.visit(Cypress.env('VITE_DEPLOY_BASE_PATH'))
  })

  it('completes the experiment without issue', () => {
    // verify the first ad page is loaded
    cy.get('.title').should('contain', 'Please help us')
    cy.contains("I'm ready!").click() // click the continue button
    cy.url().should('include', '/consent') // should go to consent next
    cy.get('.consentbox').should('contain', 'We first must verify') // verify it loaded by checking text on the page
    cy.get('.formkit-outer')
      .get('[name="consent_toggle"]')
      .check({ force: true }) // required with formkit, sorry, toggles the consent switch
    cy.contains("Let's start").click() // continue now
    cy.url().should('include', '/demograph') // should go to demographic survey next
    cy.contains('Continue').click() // click the continue button
    cy.url().should('include', '/captcha') // should go to captcha next
    cy.contains('next').click() // click the continue button
    cy.url().should('include', '/exp') // should go to the "exp" next
    cy.contains('next').click() // click to continue
    cy.url().should('include', '/debrief') // should end up on the "debrief" page
    cy.contains('next').click() // click to continue
    cy.url().should('include', '/thanks') // should end up at the "thanks" page
  })

  it('falls for the honeypot', () => {
    // if you type text into the honey pot then
    // you'll get flagged
  })
})

// mischief agents
// runs test corresponding to non-compliant/lazy participants
describe('mischief agents', () => {})

// tests that state is updated correct
describe('state integrity', () => {})

// tests for data integrity
// checks that firebase data is correct given
// user actions
describe('data integrity', () => {})
