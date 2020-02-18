const { Provider } = require('oidc-provider');
const { getConfig } = require('./config');

const config = getConfig();

const oidc = new Provider(`http://localhost:${config.port}`, {
  clients: [
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
  ]
});

const { invalidate: orig } = oidc.Client.Schema.prototype;

oidc.Client.Schema.prototype.invalidate = (message, code) => {
  if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
    return;
  }

  orig.call(this, message);
};

let server;
(async () => {
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
