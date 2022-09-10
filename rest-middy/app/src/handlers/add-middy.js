const middy = require('@middy/core');

const jsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');

/**
 * A Lambda handler function which sums two numbers.
 * @param {Object} event The Lambda event object.
 * @returns {Promise} A Promise which resolves to the Lambda response object,
 * otherwise throws an error.
 */
const add = async (event) => {
  // event is already deserialized and validated
  const { a, b } = event.body;

  // ACTUAL BUSINESS LOGIC
  const result = a + b;

  // format the response
  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  };
};

/**
 * A JSON Schema to validate the request event.
 */
const eventSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'number' },
      },
      required: ['a', 'b'],
    },
  },
};

/**
 * Wrap the handler function with middleware.
 */
exports.handle = middy()
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(httpErrorHandler())
  .handler(add);
