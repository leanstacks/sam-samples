const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
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
exports.translateConfig = { marshallOptions, unmarshallOptions };

/**
 * DynamoDBClient configuration.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/dynamodbclientconfig.html Intrface DynamoDBClientConfig}
 */
exports.clientConfig = {
  endpoint: AWS_SAM_LOCAL ? LOCAL_ENDPOINT : undefined,
  region: AWS_REGION,
};

/**
 * DynamoDBDocumentClient instance.
 */
exports.client = DynamoDBDocumentClient.from(
  new DynamoDBClient(this.clientConfig),
  this.translateConfig,
);

/**
 * Send a `PutCommand` to DynamoDB.
 * @param {Object} input A PutCommandInput object.
 * @returns {Promise} A Promise which resolves to a PutCommandOutput object if successful,
 * otherwise rejects with an error.
 */
exports.put = async (input) => {
  return this.client.send(new PutCommand(input));
};

/**
 * Send an `UpdateCommand` to DynamoDB.
 * @param {Object} input An UpdateCommandInput object.
 * @returns {Promise} A Promise which resolves to an UpdateCommandOuput object if successful,
 * otherwise rejects with an error.
 */
exports.update = async (input) => {
  return this.client.send(new UpdateCommand(input));
};

/**
 * Send a `DeleteCommand` to DynamoDB.
 * @param {Object} input A DeleteCommandInput object.
 * @returns {Promise} A Promise which resolves to a DeleteCommandOutput object if successful,
 * otherwise rejects with an error.
 */
exports.delete = async (input) => {
  return this.client.send(new DeleteCommand(input));
};

/**
 * Send a `GetCommand` to DynamoDB.
 * @param {Object} input A GetCommandInput object.
 * @returns {Promise} A Promise which resolves to a GetCommandOutput object if successful,
 * otherwise rejects with an error.
 */
exports.get = async (input) => {
  return this.client.send(new GetCommand(input));
};

/**
 * Send a `ScanCommand` to DynamoDB.
 * @param {Object} input A ScanCommandInput object.
 * @returns {Promise} A Promise which resolves to a ScanCommandOutput object if successful,
 * otherwise rejects with an error.
 */
exports.scan = async (input) => {
  return this.client.send(new ScanCommand(input));
};
