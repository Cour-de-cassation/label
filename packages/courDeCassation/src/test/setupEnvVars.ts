// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
process.env = {
  LABEL_DB_URL: 'mongodb://localhost:55431',
  LABEL_DB_NAME: 'labelDb',
  LABEL_CLIENT_URL: 'http://localhost:55432',
  LABEL_API_PORT: '55430',
  DBSDER_API_URL: 'http://localhost:3008',
  DBSDER_API_KEY: '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c',
  DBSDER_API_VERSION: 'v1',
  DBSDER_API_ENABLED: 'false',
  NLP_PSEUDONYMISATION_API_URL: 'http://localhost:8081',
  NLP_PSEUDONYMISATION_API_ENABLED: 'false',
  SDER_DB_URL: 'http://127.0.0.1:55433',
  SSO_SP_ENTITY_ID: 'SP-LABEL-DEV',
  SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION:
    'http://localhost:55430/label/api/sso/acs',
  SSO_IDP_METADATA: 'src/test/idp_metadata.xml',
  SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION:
    'http://test.sso.intranet.justice.gouv.fr:9000/saml/singleSignOn',
  SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION:
    'http://test.sso.intranet.justice.gouv.fr:9000/saml/singleLogout',
  PUBLIC_URL: '',
  SSO_ATTRIBUTE_ROLE: 'role',
  SSO_APP_NAME: 'LABEL',
  SSO_SP_PRIVATE_KEY: 'src/test/pk.txt',
  SSO_CERTIFICAT: 'src/test/crt.txt',
  RUN_MODE: 'TEST',
};
