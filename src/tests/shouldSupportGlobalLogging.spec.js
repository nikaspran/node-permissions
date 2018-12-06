const nodePermissions = require('../index');

let logCalled = false;

const assert = require('assert');
nodePermissions.protect({
  UNSAFE_allowAll: true,
  logging: (message) => {
    logCalled = true;
    assert.equal(message, 'node-permissions: No rules defined for require(\'http\')');
  },
});

require('http');
assert.ok(logCalled);
