const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
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
 * A simple handler function which fetches all items from a DynamoDB table.
 */
exports.handle = async (event) => {
  // all log statements are written to CloudWatch
  console.log(`ListItems::handle::event::${JSON.stringify(event)}`);

  // scan the table, retrieving a list of all items up to the maximum allowed by DynamoDB scan
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
  const data = await dynamoDb.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    }),
  );
  const items = data.Items;

  // format the response
  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  // all log statements are written to CloudWatch
  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
