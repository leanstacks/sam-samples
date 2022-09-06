const { validateItemDelete: validate } = require('../validators/item-validator');
const itemService = require('../services/item-service');

/**
 * A Lambda handler function which deletes an item in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handle = async (event) => {
  // all log statements are written to CloudWatch
  console.log(`DeleteItem::handle::event::${JSON.stringify(event)}`);

  let response;
  try {
    // validate the event
    const validatedEvent = validate(event);

    // parse the event
    const { itemId } = validatedEvent.pathParameters;

    // invoke business service(s) to perform logic
    await itemService.delete(itemId);

    // format the response
    response = {
      statusCode: 204,
    };
  } catch (error) {
    response = {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        name: error.name,
        message: error.message,
      }),
    };
  }

  // all log statements are written to CloudWatch
  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
