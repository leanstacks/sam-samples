const itemService = require('../../../services/item-service');

/**
 * A Lambda handler function which deletes an item in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handler = async (event) => {
  console.log(`deleteItem::event::${JSON.stringify(event)}`);

  const { itemId } = event.pathParameters;

  await itemService.delete(itemId);

  const response = {
    statusCode: 204,
  };

  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
