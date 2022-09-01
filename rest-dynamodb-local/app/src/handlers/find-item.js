const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// Create clients and set shared const values outside of the handler function.

// Get environment variable values
const TABLE_NAME = process.env.SAMPLE_TABLE;
const AWS_REGION = process.env.AWS_REGION;
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
if (AWS_SAM_LOCAL) {
  dynamoDBClientConfig.endpoint = 'http://dynamodb:8000';
}
const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient(dynamoDBClientConfig),
  translateConfig,
);

/**
 * A simple handler function which fetches a single item from DynamoDB by identifier.
 */
exports.handle = async (event) => {
  // all log statements are written to CloudWatch
  console.log(`FindItem::handle::event::${JSON.stringify(event)}`);

  // Get id from pathParameters from APIGateway Lambda event.
  // Named in template.yaml with `Path` configuration of `/{itemId}`
  const { itemId } = event.pathParameters;

  // get the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  const data = await dynamoDb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: itemId },
    }),
  );
  const item = data.Item;

  // format the response
  let response;
  if (item) {
    response = {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  } else {
    response = {
      statusCode: 404,
    };
  }

  // all log statements are written to CloudWatch
  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
