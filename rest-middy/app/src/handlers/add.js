/**
 * A Lambda handler function which sums two numbers.
 * @param {Object} event The Lambda event object.
 * @returns {Promise} A Promise which resolves to the Lambda response object,
 * otherwise throws an error.
 */
exports.handle = async (event) => {
  console.log(`Add::handle::event::${JSON.stringify(event)}`);

  let response;
  try {
    // deserialize the event body
    const body = JSON.parse(event.body);

    // validate the event
    const { a, b } = body;
    if (!a) {
      throw new Error('"a" is required');
    }
    if (typeof a !== 'number') {
      throw new Error('"a" must be a number');
    }
    if (!b) {
      throw new Error('"b" is required');
    }
    if (typeof b !== 'number') {
      throw new Error('"b" must be a number');
    }

    // ACTUAL BUSINESS LOGIC
    const result = a + b;

    // format the response
    response = {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    // handle errors
    response = {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        name: error.name,
        message: error.message,
      }),
    };
  }

  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );
  return response;
};
