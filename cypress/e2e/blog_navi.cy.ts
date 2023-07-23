describe('blog navigation test', () => {
  it('visiting / should direct to /home', () => {
    cy.visit('/');
    cy.url().should('match', /\/home/);
  });

  it('navigation via AppBar', () => {
    cy.visit('/home');
    cy.get('a[href=\'/blog\']').first().click();
    cy.url().should('match', /\/blog/);
    cy.get('a[href=\'/about\']').first().click();
    cy.url().should('match', /\/about/);
    cy.get('a[href=\'/home\']').first().click();
    cy.url().should('match', /\/home/);
  });

  it('latest blog', () => {
    cy.visit('/blog');
    cy.get('main a').contains('blog').first().click();
    cy.url().should('match', /\/blog\/\d+/);
    cy.get('main h3').contains('blog');
  });
});
