const { Provider } = require('oidc-provider');
const { getConfig } = require('./config');

const config = getConfig();

const oidcConfig = {
  features: {
    devInteractions: true,
    discovery: true,
    registration: false,
    revocation: true,
    sessionManagement: false
  },
  format: {
    default: 'jwt',
    AccessToken: 'jwt',
    RefreshToken: 'jwt'
  }
};

const oidc = new Provider(`http://localhost:${config.port}`, oidcConfig);

const clients = [
  {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uris: [config.clientRedirectUri],
    post_logout_redirect_uris: [config.clientLogoutRedirectUri],
    application_type: config.applicationType,
    token_endpoint_auth_method: 'none',
    response_types: ['id_token'],
    grant_types: ['implicit']

  }
];

let server;
(async () => {
  await oidc.initialize({ clients });

  server = oidc.listen(config.port, () => {
    console.log(
      `fake-oidc-server listening on port ${config.port}, check http://localhost:${config.port}/.well-known/openid-configuration`
    );
  });
})().catch(err => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});
