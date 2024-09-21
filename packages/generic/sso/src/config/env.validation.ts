import * as Joi from 'joi';

export const envValidationConfig = {
  cache: true,
  validationSchema: Joi.object({
    JWT_PRIVATE_KEY: Joi.string().required(),
    SSO_SP_ENTITY_ID: Joi.string().required(),
    SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION: Joi.string().required(),
    SSO_IDP_METADATA: Joi.string().required(),
    SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION: Joi.string().required(),
    SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION: Joi.string().required(),
    SSO_ONE_WEEK: Joi.number().required(),
    SSO_BEARER_TOKEN: Joi.string().required(),
    SSO_USER_ID: Joi.string().required(),
    SSO_USER_EMAIL: Joi.string().required(),
    SSO_USER_NAME: Joi.string().required(),
    SSO_USER_ROLE: Joi.string().required(),
    SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL: Joi.string().required(),
    SSO_FRONT_SUCCESS_CONNEXION_OTHER_URL: Joi.string().required(),
    // for users tests
    SSO_USER_TEST_ANNOTATOR_NAME: Joi.string().required(),
    SSO_USER_TEST_ANNOTATOR_ROLE: Joi.string().required(),
    SSO_USER_TEST_ANNOTATOR_ID: Joi.string().required(),
    SSO_USER_TEST_SCRUTATOR_NAME: Joi.string().required(),
    SSO_USER_TEST_SCRUTATOR_ROLE: Joi.string().required(),
    SSO_USER_TEST_SCRUTATOR_ID: Joi.string().required(),
    SSO_USER_TEST_ADMIN_NAME: Joi.string().required(),
    SSO_USER_TEST_ADMIN_ROLE: Joi.string().required(),
    SSO_USER_TEST_ADMIN_ID: Joi.string().required(),
  })
}
