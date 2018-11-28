const assert = require('assert');
const nodePermissions = require('../index');
nodePermissions.protect();

const preDeleteCache = require.cache;

try {
  delete require.cache;
} catch (e) {
  process.exit(0);
}

console.log(require.cache);
assert.equal(preDeleteCache, require.cache);
