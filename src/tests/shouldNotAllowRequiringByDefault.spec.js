const nodePermissions = require('../index');

const assert = require('assert');
nodePermissions.protect();

assert.throws(() => {
  require('http');
}, /PermissionDenied/);
