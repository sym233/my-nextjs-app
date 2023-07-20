describe('first spec', () => {
  it('visiting / should direct to /home', () => {
    cy.visit('http://127.0.0.1:3000');
    cy.url().should('match', /\/home/);
  });

  it('can visit /blog', () => {
    cy.visit('http://127.0.0.1:3000/home');
    cy.get('a[href=\'/blog\']').click();
    cy.url().should('match', /\/blog/);
  });
});
