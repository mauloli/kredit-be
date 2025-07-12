const assert = require('assert');
const app = require('../../src/app');

describe('\'notificiation\' service', () => {
  it('registered the service', () => {
    const service = app.service('notificiation');

    assert.ok(service, 'Registered the service');
  });
});
