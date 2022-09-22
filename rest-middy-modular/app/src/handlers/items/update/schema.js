const Joi = require('joi');

/**
 * A JSON Schema to validate the request event.
 */
exports.eventSchema = Joi.object({
  pathParameters: Joi.object({
    itemId: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().required(),
  }),
});
