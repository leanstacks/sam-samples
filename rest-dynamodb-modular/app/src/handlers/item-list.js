const { validateItemList: validate } = require('../validators/item-validator');
const itemService = require('../services/item-service');

/**
 * A Lambda handler function which lists items in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handle = async (event) => {
  // all log statements are written to CloudWatch
  console.log(`ListItems::handle::event::${JSON.stringify(event)}`);

  let response;
  try {
    // validate the event
    validate(event);

    // invoke business service(s) to perform logic
    const items = await itemService.list();

    // format the response
    response = {
      statusCode: 200,
      body: JSON.stringify(items),
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
