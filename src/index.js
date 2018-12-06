const pathLib = require('path');
const nodeModule = require('module');

class PermissionDenied extends Error {
  constructor(message = 'Permission Denied') {
    super(message);
    this.code = 'PERMISSION_DENIED';
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line no-unused-vars
function permits({ rule, path, loadingFrom, isMain }) {
  const { allowRequireFrom } = rule;

  if (typeof allowRequireFrom === 'string') {
    const fullPathRegexp = new RegExp(`^${pathLib.join(process.cwd(), allowRequireFrom)}`);
    return fullPathRegexp.test(loadingFrom.filename);
  }

  return false;
}

function protect({
  rules = [],
  UNSAFE_allowAll: allowAll = false,
  logging,
} = {}) {
  // TODO: custom cache, Object.create(null); ?
  const rulesByModule = rules.reduce((result, rule) => ({
    ...result,
    [rule.module]: rule,
  }), {});

  const originalCache = require.cache;
  Object.defineProperty(require, 'cache', {
    enumerable: true,
    configurable: false,
    get() {
      return originalCache;
    },
  });

  function maybeLogAndThrow(error) {
    if (logging) {
      logging(`node-permissions: ${error}`);
    }

    if (!allowAll) {
      throw new PermissionDenied(error);
    }
  }

  const originalLoad = nodeModule._load; // eslint-disable-line no-underscore-dangle
  function loadWithPermissions(path, loadingFrom, isMain) {
    const ruleForModule = rulesByModule[path]; // TODO: allow multiple rules for same path
    if (!ruleForModule) {
      maybeLogAndThrow(`No rules defined for require('${path}')`);
    }

    if (ruleForModule && !permits({ rule: ruleForModule, path, loadingFrom, isMain })) {
      maybeLogAndThrow(`Module ${loadingFrom.filename} is not allowed to require('${path}')`);
    }

    return originalLoad.apply(undefined, arguments); // eslint-disable-line prefer-spread, prefer-rest-params
  }

  Object.defineProperty(nodeModule, '_load', {
    enumerable: false,
    configurable: false,
    get() {
      return loadWithPermissions;
    },
    set() { // noop
    },
  });
}

module.exports = {
  protect,
};
