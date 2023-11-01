import { modStr } from './utils';

describe('login api', () => {
  const username = 'test2';
  const password = 'testpassword';

  before(() => {
    // register
    cy.request('post', '/api/user', { username, password });
  });

  it('invalid parameter', () => {
    cy.request('post', '/api/session', { username }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });
  });

  it('should not login', () => {
    cy.request('post', '/api/session', {
      username,
      password: modStr(password),
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });
  });

  let session = '';
  it('should login', () => {
    cy.request('post', '/api/session', {
      username,
      password,
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert(body.ok);
      assert.isString(body.data.sessionId);
      session = body.data.sessionId;
    });
  });

  it('not login status', () => {
    cy.request('get', '/api/session').then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });

    cy.request({
      url: '/api/session',
      method: 'get',
      headers: {
        Authentication: modStr(session),
      },
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });
  });

  it('should be valid session', () => {
    cy.request({
      url: '/api/session',
      method: 'get',
      headers: {
        Authentication: session,
      },
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert(body.ok);
      assert.hasAnyKeys(body.data, ['userId']);
      assert.equal(body.data.username, username);
    });
  });

  it('should not logout', () => {
    cy.request({
      url: '/api/session',
      method: 'delete',
      headers: {
        Authentication: modStr(session),
      },
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
    });
  });

  it('should logout', () => {
    cy.request({
      url: '/api/session',
      method: 'delete',
      headers: {
        Authentication: session,
      },
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert(body.ok);
    });
  });

  it('session should be invalid', () => {
    cy.request({
      url: '/api/session',
      method: 'get',
      headers: {
        Authentication: session,
      },
    }).then(response => {
      const { body, status } = response;
      assert.equal(status, 200);
      assert.isNotTrue(body.ok);
      assert.hasAnyKeys(body, ['err']);
    });
  });

  after(() => {
    // delete this user
    cy.request('delete', '/api/user', { username, password });
  });
});
