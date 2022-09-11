const itemService = require('../../../services/item-service');

/**
 * A Lambda handler function which lists items in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handler = async (event) => {
  console.log(`listItems::event::${JSON.stringify(event)}`);

  const items = await itemService.list();

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
