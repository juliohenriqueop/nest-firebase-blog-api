// https://github.com/facebook/jest/issues/9771

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jestNodeExportsResolver = require('jest-node-exports-resolver');

module.exports = function (request, options) {
  const pnpmModulePathRegex = /(.+pnpm\/.+?\/|.+pnpm\\.+?\\)/;
  const pnpmModulePath = options.basedir.match(pnpmModulePathRegex)?.[0];

  if (pnpmModulePath) {
    const ownNodeModulesPath = pnpmModulePath.concat('node_modules');
    options.paths.push(ownNodeModulesPath);

    return options.defaultResolver(request, options);
  }

  return jestNodeExportsResolver(request, options);
};
