const nodePermissions = require('../index');

const assert = require('assert');
nodePermissions.protect();

const preDeleteCache = require.cache;

delete require.cache;

// assert.equal(preDeleteCache, require.cache);
