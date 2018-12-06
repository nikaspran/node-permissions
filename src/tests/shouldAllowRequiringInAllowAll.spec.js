const nodePermissions = require('../index');

const assert = require('assert');
nodePermissions.protect({
  UNSAFE_allowAll: true,
});

const http = require('http');
assert.ok(http.request);
