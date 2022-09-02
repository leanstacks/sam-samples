const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
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
 * A simple handler function which creates an item in DynamoDB
 */
exports.handle = async (event) => {
  let response;

  try {
    // all log statements are written to CloudWatch
    console.log(`UpdateItem::handle::event::${JSON.stringify(event)}`);

    // Get id from pathParameters from APIGateway Lambda event.
    // Named in template.yaml with `Path` configuration of `/{itemId}`
    const { itemId } = event.pathParameters;
    // parse the request
    const { name } = JSON.parse(event.body);

    // create a new item in the table
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    const updatedAt = new Date().toISOString();

    const data = await dynamoDb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: itemId },
        UpdateExpression: 'set #nm = :nm, updatedAt = :ua',
        ConditionExpression: 'id = :iid',
        ExpressionAttributeNames: {
          '#nm': 'name',
        },
        ExpressionAttributeValues: {
          ':iid': itemId,
          ':nm': name,
          ':ua': updatedAt,
        },
        ReturnValues: 'ALL_NEW',
      }),
    );

    response = {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
  } catch (err) {
    console.error(`Error in UpdateItem handler. Details: ${err}`);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Unable to update item.',
      }),
    };

    switch (err.name) {
      case 'ConditionalCheckFailedException':
        response.statusCode = 404;
        delete response.body;
        break;
    }
  }

  // all log statements are written to CloudWatch
  console.log(
    `response::${event.httpMethod}::${event.path}::${response.statusCode}::${response.body}`,
  );

  return response;
};
