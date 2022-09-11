const itemService = require('../../../services/item-service');

/**
 * A Lambda handler function which creates an item in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handler = async (event) => {
  console.info(`createItem::event::${JSON.stringify(event)}`);

  const item = await itemService.create(event.body);

  const response = {
    statusCode: 201,
    body: JSON.stringify(item),
  };

  console.info(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
