const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');

// Create clients and set shared const values outside of the handler function.

// Get environment variable values
const TABLE_NAME = process.env.SAMPLE_TABLE;
const AWS_REGION = process.env.AWS_REGION;
// AWS_SAM_LOCAL="true" when using any 'sam local...' command
const AWS_SAM_LOCAL = process.env.AWS_SAM_LOCAL;

// Create an AWS DynamoDBDocumentClient
// configure the AWS DynamoDBDocumentClient
const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
};
const unmarshallOptions = {
  wrapNumbers: false,
};
const translateConfig = { marshallOptions, unmarshallOptions };
const dynamoDBClientConfig = {
  region: AWS_REGION,
};
// If running locally, connect to local DynamoDBs
if (AWS_SAM_LOCAL) {
  dynamoDBClientConfig.endpoint = 'http://dynamodb:8000';
}
const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient(dynamoDBClientConfig),
  translateConfig,
);

/**
 * A simple handler function which creates an item in DynamoDB
 */
exports.handle = async (event) => {
  // all log statements are written to CloudWatch
  console.log(`CreateItem::handle::event::${JSON.stringify(event)}`);

  // parse the request
  const { name } = JSON.parse(event.body);

  // create a new item in the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  const id = crypto.randomBytes(8).toString('hex');
  const itemObj = {
    id,
    name,
    createdAt: new Date().toISOString(),
  };
  await dynamoDb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: itemObj,
      ConditionExpression: 'attribute_not_exists(id)',
    }),
  );

  const response = {
    statusCode: 201,
    body: JSON.stringify(itemObj),
  };

  // all log statements are written to CloudWatch
  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
