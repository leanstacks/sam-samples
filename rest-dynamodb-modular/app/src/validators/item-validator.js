const Joi = require('joi');

const validator = require('./validator');

/**
 *
 * @param {Object} event The Lambda function handler event.
 * @returns
 */
exports.createItem = (event) => {
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
