const http = require('http');

function protect(options = {}) {
  // TODO: custom cache, Object.create(null); ?

  const originalCache = require.cache;
  Object.defineProperty(require, 'cache', {
    enumerable: true,
    configurable: false,
    get() {
      return originalCache;
    }
  });

  Object.defineProperty(require.cache, 'http', {
    enumerable: false,
    configurable: false,
    get() {
      return { exports: http };
    },
    set() { // noop
    }
  });
}

module.exports = {
  protect,
}
