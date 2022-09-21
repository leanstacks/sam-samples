const Joi = require('joi');

/**
 * A Joi schema to validate the request event.
 */
exports.eventSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
  }),
});
