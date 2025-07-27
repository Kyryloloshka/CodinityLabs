import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().required(),
  AUTH_SERVICE_URL: Joi.string().uri().required(),
  ASSIGNMENT_SERVICE_URL: Joi.string().uri().required(),
});
