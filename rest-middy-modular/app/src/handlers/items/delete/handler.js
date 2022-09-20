const itemService = require('../../../services/item-service');

/**
 * A Lambda handler function which deletes an item in DynamoDB.
 * @param {Object} event The Lambda event. An API Gateway event.
 * @returns {Promise} A Promise which resolves to a Lambda function response
 * if successful, otherwise rejects with an error.
 */
exports.handler = async (event) => {
  const { itemId } = event.pathParameters;

  await itemService.delete(itemId);

  const response = {
    statusCode: 204,
  };

  return response;
};
