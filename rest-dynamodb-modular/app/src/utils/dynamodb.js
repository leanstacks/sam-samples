const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// Get environment variable values
const AWS_REGION = process.env.AWS_REGION;
const AWS_SAM_LOCAL = process.env.AWS_SAM_LOCAL;
const LOCAL_ENDPOINT = 'http://dynamodb:8000';

/**
 * DynamoDBDocumentClient marshalling options.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/interfaces/_aws_sdk_util_dynamodb.marshalloptions-1.html Interface marshallOptions}
 */
const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
};
/**
 * DynamoDBDocumentClient unmarshalling configuration.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/interfaces/_aws_sdk_util_dynamodb.unmarshalloptions-1.html Interface unmarshallOptions}
 */
const unmarshallOptions = {
  wrapNumbers: false,
};
/**
 * DynamoDBDocumentClient translation configiuration.
 */
const translateConfig = { marshallOptions, unmarshallOptions };

/**
 * DynamoDBClient configuration.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/dynamodbclientconfig.html Intrface DynamoDBClientConfig}
 */
const clientConfig = {
  endpoint: AWS_SAM_LOCAL ? LOCAL_ENDPOINT : undefined,
  region: AWS_REGION,
};

/**
 * Get a fully configured `DynamoDBDocumentClient` instance.
 * @returns {DynamoDBDocumentClient} A `DynamoDBDocumentClient` instance.
 */
exports.getDocumentClient = () => {
  return DynamoDBDocumentClient.from(new DynamoDBClient(clientConfig), translateConfig);
};
