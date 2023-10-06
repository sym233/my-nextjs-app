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
      password: password + '1',
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
        Authentication: session + '1',
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
    });
  });

  it('should not logout', () => {
    cy.request({
      url: '/api/session',
      method: 'patch',
      headers: {
        Authentication: session + '1',
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
      method: 'patch',
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
    cy.request('patch', '/api/user', { username, password });
  });
});
