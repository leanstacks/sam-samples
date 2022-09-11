const createError = require('http-errors');

const itemService = require('../../../services/item-service');

/**
 * A Lambda handler function which finds an item in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handler = async (event) => {
  console.log(`findItem::event::${JSON.stringify(event)}`);

  const { itemId } = event.pathParameters;

  const item = await itemService.find(itemId);

  if (!item) {
    throw new createError.NotFound();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(item),
  };

  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
