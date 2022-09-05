const Joi = require('joi');

const validator = require('./validator');

/**
 * Validates the create item Lambda function event. This is an API Gateway event object.
 * @param {Object} event The Lambda function handler event.
 * @returns {Object} A validated event object if successful; otherwise throws a ValidationError.
 * @see {@link validator.validate} for further information.
 */
exports.validateItemCreate = (event) => {
  // prepare event for validation
  const aEvent = {
    ...event,
    body: JSON.parse(event.body),
  };

  // define the validation schema
  const schema = Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
    }),
  });

  // perform validation; return validated event or throw error
  return validator.validate(schema, aEvent);
};
