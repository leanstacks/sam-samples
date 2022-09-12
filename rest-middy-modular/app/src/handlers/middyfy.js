const middy = require('@middy/core');

// middlewares
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');

/**
 * Creates a 'middyfied' AWS Lambda handler function wrapped with Middy middlewares.
 * @param {Object} options Middleware options.
 * @returns A middleware-wrapped AWS Lambda handler function.
 */
exports.middyfy = (options) => {
  const { handler, eventSchema } = options;
  return middy()
    .use(jsonBodyParser())
    .use(validator({ eventSchema }))
    .use(httpErrorHandler({ fallbackMessage: 'Unhandled error' }))
    .handler(handler);
};
