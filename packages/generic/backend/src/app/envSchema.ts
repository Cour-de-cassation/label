import Joi from 'joi';

export const envSchema = Joi.object({
  LABEL_DB_URL: Joi.string().uri().required(),
  LABEL_DB_NAME: Joi.string().required(),
  LABEL_CLIENT_URL: Joi.string().uri().required(),
  LABEL_API_PORT: Joi.number().port().required(),
  DBSDER_API_URL: Joi.string().uri().required(),
  DBSDER_API_KEY: Joi.string().required(),
  NLP_PSEUDONYMISATION_API_URL: Joi.string().uri().required(),
  NLP_PSEUDONYMISATION_API_ENABLED: Joi.boolean().required(),
  JWT_PRIVATE_KEY: Joi.string().required(),
}).unknown();
