// @ts-ignore
// pas à laise avec les ts-ignore..
process.env = {
  SSO_SP_ENTITY_ID: 'SP-LABEL-DEV',
  SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION: 'http://localhost:3005/saml/acs',
  SSO_IDP_METADATA: 'sso_idp_metadata.xml',
  SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION : 'http://localhost:8080/realms/nouveau-realm/protocol/saml',
  SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION : 'http://localhost:8080/realms/nouveau-realm/protocol/saml',
  PUBLIC_URL: '',
  SSO_ATTRIBUTE_ROLE: 'role',
  SSO_APP_NAME: 'LABEL'
}
