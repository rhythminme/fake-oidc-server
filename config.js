const assert = require('assert');
const camelCase = require('camelcase');

export const getConfig = () => {
  const port = process.env.PORT || 4001;
  const oidcMode = process.env['OIDC_MODE'] || 'implicit';

  const commonParams = { port };
  if (oidcMode.toLowerCase() === 'implicit') {
    return ['CLIENT_ID', 'APPLICATION_TYPE', 'CLIENT_REDIRECT_URI', 'CLIENT_LOGOUT_REDIRECT_URI'].reduce((acc, v) => {
      assert(process.env[v], `${v} config missing`);
      acc[camelCase(v)] = process.env[v];
      return acc;
    }, commonParams);
  }
  return ['CLIENT_ID', 'CLIENT_SECRET', 'CLIENT_REDIRECT_URI', 'CLIENT_LOGOUT_REDIRECT_URI'].reduce((acc, v) => {
    assert(process.env[v], `${v} config missing`);
    acc[camelCase(v)] = process.env[v];
    return acc;
  }, commonParams);
};
