const { validateItemUpdate: validate } = require('../validators/item-validator');
const itemService = require('../services/item-service');

/**
 * A Lambda handler function which updates an item in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handle = async (event) => {
  // all log statements are written to CloudWatch
  console.log(`UpdateItem::handle::event::${JSON.stringify(event)}`);

  let response;
  try {
    // validate the event
    const validatedEvent = validate(event);

    // parse the request
    const { itemId } = validatedEvent.pathParameters;
    const itemToUpdate = validatedEvent.body;

    // invoke business service(s) to perform logic
    const item = await itemService.update(itemId, itemToUpdate);

    // format the response
    if (item) {
      response = {
        statusCode: 200,
        body: JSON.stringify(item),
      };
    } else {
      response = {
        statusCode: 404,
      };
    }
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
