const Joi = require('joi');

const validator = require('./validator');

/**
 * Formats a Lambda event, an API Gateway event object, to prepare for validation.
 * @param {Object} event The Lambda event.
 * @returns An formatted event ready for validation.
 */
const formatEvent = (event) => {
  return {
    ...event,
    body: JSON.parse(event.body),
  };
};

/**
 * Validates the create item Lambda function event. This is an API Gateway event object.
 * @param {Object} event The Lambda function handler event.
 * @returns {Object} A validated event object if successful; otherwise throws a ValidationError.
 * @see {@link validator.validate} for further information.
 */
exports.validateItemCreate = (event) => {
  // format event for validation
  const aEvent = formatEvent(event);

  // define the validation schema
  const schema = Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
    }),
  });

  // perform validation; return validated event or throw error
  return validator.validate(schema, aEvent);
};

/**
 * Validates the update item Lambda function event. This is an API Gateway event object.
 * @param {Object} event The Lambda function handler event.
 * @returns {Object} A validated event object if successful; otherwise throws a ValidationError.
 * @see {@link validator.validate} for further information.
 */
exports.validateItemUpdate = (event) => {
  // format event for validation
  const aEvent = formatEvent(event);

  // define the validation schema
  const schema = Joi.object({
    pathParameters: Joi.object({
      itemId: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().required(),
    }),
  });

  // perform validation; return validated event or throw error
  return validator.validate(schema, aEvent);
};

/**
 * Validates the delete item Lambda function event. This is an API Gateway event object.
 * @param {Object} event The Lambda function handler event.
 * @returns {Object} A validated event object if successful; otherwise throws a ValidationError.
 * @see {@link validator.validate} for further information.
 */
exports.validateItemDelete = (event) => {
  // format event for validation
  const aEvent = formatEvent(event);

  // define the validation schema
  const schema = Joi.object({
    pathParameters: Joi.object({
      itemId: Joi.string().required(),
    }),
  });

  // perform validation; return validated event or throw error
  return validator.validate(schema, aEvent);
};

/**
 * Validates the find item Lambda function event. This is an API Gateway event object.
 * @param {Object} event The Lambda function handler event.
 * @returns {Object} A validated event object if successful; otherwise throws a ValidationError.
 * @see {@link validator.validate} for further information.
 */
exports.validateItemFind = (event) => {
  // format event for validation
  const aEvent = formatEvent(event);

  // define the validation schema
  const schema = Joi.object({
    pathParameters: Joi.object({
      itemId: Joi.string().required(),
    }),
  });

  // perform validation; return validated event or throw error
  return validator.validate(schema, aEvent);
};

/**
 * Validates the list item Lambda function event. This is an API Gateway event object.
 * @param {Object} event The Lambda function handler event.
 * @returns {Object} A validated event object if successful; otherwise throws a ValidationError.
 * @see {@link validator.validate} for further information.
 */
exports.validateItemList = (event) => {
  // format event for validation
  const aEvent = formatEvent(event);

  // define the validation schema
  const schema = Joi.object();

  // perform validation; return validated event or throw error
  return validator.validate(schema, aEvent);
};
