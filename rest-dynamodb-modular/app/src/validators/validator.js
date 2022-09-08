const ValidationError = require('../errors/validation-error');

/**
 * Joi validate configuration.
 * @see {@link https://joi.dev/api#anyvalidatevalue-options Joi validate options}
 */
const validateOptionDefaults = {
  abortEarly: false,
  allowUnknown: true,
};

/**
 * Validate an object using a Joi schema.
 * @param {Object} schema A Joi schema to validate the Object.
 * @param {Object} obj An Object to be validated.
 * @param {Object} options (Optional) Joi validation options.
 * @returns The validated Object if successful.
 * @throws A ValidationError if validation fails.
 * @see https://joi.dev/api/
 * @see https://joi.dev/api#validationerror
 */
exports.validate = (schema, obj, options = {}) => {
  const validateOptions = {
    ...validateOptionDefaults,
    ...options,
  };

  const { value, error } = schema.validate(obj, validateOptions);
  if (error) {
    console.warn(`Validation error. Detail: ${error}`);
    throw new ValidationError(error.message);
  }
  return value;
};
