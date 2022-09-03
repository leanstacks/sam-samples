const { DynamoDBDocumentClient, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

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
 * A simple handler function which deletes an item from DynamoDB
 */
exports.handle = async (event) => {
  // all log statements are written to CloudWatch
  console.log(`DeleteItem::handle::event::${JSON.stringify(event)}`);

  // Get id from pathParameters from APIGateway Lambda event.
  // Named in template.yaml with `Path` configuration of `/{itemId}`
  const { itemId } = event.pathParameters;

  // delete an item from the table
  await dynamoDb.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        id: itemId,
      },
    }),
  );

  const response = {
    statusCode: 204,
  };

  // all log statements are written to CloudWatch
  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
