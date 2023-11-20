describe('login test', () => {
  const username = 'test2';
  const password = 'testpassword';

  before(() => {
    // register
    cy.request('post', '/api/user', { username, password });
  });

  it('not logged in status', () => {
    cy.visit('/')
      .get('nav a')
      .contains(/log in/i);

    cy.visit('/profile')
      .get('main p')
      .contains(/not logged in/i);
  });

  it('login page', () => {
    cy.visit('/')
      .get('nav a')
      .contains(/log in/i)
      .click()
      .url()
      .should('match', /login/);
  });

  it('login', () => {
    cy.visit('/login')
      .get('button')
      .contains(/ok/i)
      .as('btn')
      .should('be.disabled');

    cy.get('input[placeholder="username"]')
      .type(username)
      .end()
      .get('@btn')
      .should('be.disabled');

    cy.get('input[placeholder="password"]')
      .as('pwd')
      .type(password + '1')
      .end()
      .get('@btn')
      .should('be.enabled');

    cy.get('@btn')
      .click()
      .end()
      .get('div p')
      .contains(/credential error/i);

    cy.get('@pwd')
      .clear()
      .type(password)
      .end()
      .get('@btn')
      .click()
      .get('div p')
      .contains(/logged in/i)
      .contains(username);

    cy.get('nav')
      .contains(username)
      .end()
      .get('nav #user-drop-down')
      .contains(/profile/i);
  });

  after(() => {
    cy.request('delete', '/api/user', { username, password });
  });
});

describe('log in status', () => {
  const username = 'test2';
  const password = 'testpassword';

  before(() => {
    // register
    cy.request('post', '/api/user', { username, password });
  });

  beforeEach(() => {
    cy.visit('/login')
      .get('input[placeholder="username"]')
      .type(username)
      .get('input[placeholder="password"]')
      .type(password)
      .get('button')
      .contains(/ok/i)
      .click();
  });

  it('profile', () => {
    cy.get('nav #user-drop-down')
      .contains(/profile/i)
      .click({ force: true })
      .url()
      .should('match', /profile/i)
      .end()
      .get('p')
      .contains('user:')
      .contains(username);
  });

  it('logout', () => {
    cy.get('p')
      .contains(/logged in/i)
      .contains(username)
      .end()
      .get('button')
      .contains(/log out/i)
      .click()
      .end()
      // wait for ajax
      .wait(500)
      .getCookie('sessionId')
      .should('be.null');
  });
});
