const middy = require('@middy/core');

// middlewares
const jsonBodyParser = require('@middy/http-json-body-parser');

// custom middlewares
const ioLogger = require('../middlewares/io-logger');
const errorHandler = require('../middlewares/error-handler');
const validator = require('../middlewares/validator');

/**
 * Creates a 'middyfied' AWS Lambda handler function wrapped with Middy middlewares.
 * @param {Object} options Middleware options.
 * @returns A middleware-wrapped AWS Lambda handler function.
 */
exports.middyfy = (options) => {
  const { handler, eventSchema, responseSchema } = options;
  return middy()
    .use(ioLogger())
    .use(jsonBodyParser())
    .use(validator({ eventSchema, responseSchema }))
    .use(errorHandler())
    .handler(handler);
};
