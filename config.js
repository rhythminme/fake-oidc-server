const assert = require('assert');
const camelCase = require('camelcase');

module.exports.getConfig = () => {
  const port = process.env.SERVER_PORT || 4001;

  const commonParams = { port };
  return ['CLIENT_ID', 'CLIENT_SECRET', 'APPLICATION_TYPE', 'CLIENT_REDIRECT_URI', 'CLIENT_LOGOUT_REDIRECT_URI'].reduce((acc, v) => {
    assert(process.env[v], `${v} environment variable is not set`);
    acc[camelCase(v)] = process.env[v];
    return acc;
  }, commonParams);
};
