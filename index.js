const { Provider } = require('oidc-provider');
const { getConfig } = require('./config');

const config = getConfig();

const oidc = new Provider(`http://localhost:${config.port}`, {
  features: {
    registration: { enabled: false }
  },
  responseTypes: [
    'code id_token token',
    'code id_token',
    'code token',
    'code',
    'id_token token',
    'id_token',
    'none',
  ],
  findAccount: (ctx, id) => {
    if (id === 'notfound') return undefined;
    return {
      accountId: id,
      claims() { return { sub: id, email: 'foo@example.com', email_verified: false }; },
    };
  },
  claims: {
    email: ['email', 'email_verified'],
  },
  clients: [
    {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uris: [config.clientRedirectUri],
      post_logout_redirect_uris: [config.clientLogoutRedirectUri],
      application_type: config.applicationType,
      grant_types: ['implicit', 'authorization_code'],
      response_types: ['id_token', 'id_token token', 'code token', 'none'],
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
