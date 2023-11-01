import { modStr } from './utils';

describe('register api', () => {
  const username = 'test1';
  const password = 'testpassword';

  before(() => {
    cy.request('delete', '/api/user', { username, password }).then(response => {
      const { status } = response;
      assert.equal(status, 200);
    });
  });

  it('invalid parameter', () => {
    cy.request('post', '/api/user', { username }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });
  });

  it('success reg', () => {
    cy.request('post', '/api/user', { username, password }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert(body.ok);
    });
  });

  it('should register failed', () => {
    cy.request('post', '/api/user', { username, password }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });
  });

  it('should not delete user', () => {
    cy.request('delete', '/api/user', {
      username,
      password: modStr(password),
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });
  });

  it('should delete user', () => {
    cy.request('delete', '/api/user', { username, password }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert(body.ok);
    });
  });
});
