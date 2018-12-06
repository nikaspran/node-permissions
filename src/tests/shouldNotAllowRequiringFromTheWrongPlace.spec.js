const nodePermissions = require('../index');

const assert = require('assert');
nodePermissions.protect({
  rules: [
    { module: 'http', allowRequireFrom: 'node_modules/' },
  ],
});

assert.throws(() => {
  require('http');
}, /PermissionDenied/);
