const nodePermissions = require('../index');

const assert = require('assert');
nodePermissions.protect({
  rules: [
    { module: 'http', allowRequireFrom: 'src/' },
  ],
});

const http = require('http');
assert.ok(http.request);
