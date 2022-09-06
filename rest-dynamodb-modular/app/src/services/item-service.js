const crypto = require('crypto');
const { DeleteCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const ValidationError = require('../errors/validation-error');
const dynamoDb = require('../utils/dynamodb');

const TABLE_NAME = process.env.SAMPLE_TABLE;

const dbClient = dynamoDb.getDocumentClient();

/**
 * Create and store an item.
 * @param {Object} item An item object to be created.
 * @returns {Promise} A Promise which resolves to the created item if successful,
 * otherwise rejects with an error.
 */
exports.create = async (item) => {
  console.log('ItemService::create');

  try {
    // compose the item to be stored in the table
    const id = crypto.randomBytes(8).toString('hex');
    const { name } = item;

    const itemObj = {
      id,
      name,
      createdAt: new Date().toISOString(),
    };

    // create a new item in the table
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/putitemcommandinput.html
    await dbClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: itemObj,
        ConditionExpression: 'attribute_not_exists(id)',
      }),
    );

    // PutCommand does not return the stored item; DynamoDB does not modify the item being stored
    // return the composed item
    return itemObj;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new ValidationError('The ID value is in use. Try again.');
    }
    console.error('Error caught creating Item. Detail: ', error);
    throw error;
  }
};

/**
 * Deletes an item, removing it from the DynamoDB table.
 * @param {string} id An item identifier.
 * @returns {Promise} A Promise which resolves to `null` if successful,
 * otherwise rejects with an error.
 */
exports.delete = async (id) => {
  console.log('ItemService::delete');

  // delete an item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/deleteitemcommandinput.html
  await dbClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        id,
      },
    }),
  );
};
