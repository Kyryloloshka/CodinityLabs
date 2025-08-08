import Joi from 'joi';

// Validation schema for environment variables
export const envSchema = Joi.object({
  API_BASE_URL: Joi.string().uri().required(),
  TOKEN_REFRESH_INTERVAL_MS: Joi.number().integer().min(1000).max(300000).required(),
});

// Validate environment variables
export const validateEnv = () => {
  const { error, value: envVars } = envSchema.validate(process.env, { allowUnknown: true });
  if (error) {
    console.error('❌ Environment validation failed:');
    console.error('Missing or invalid environment variables:');
    error.details.forEach(detail => {
      console.error(`  - ${detail.message}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  return envVars;
}; 