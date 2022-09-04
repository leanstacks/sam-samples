// Import all functions from update-item.js
const lambda = require('../item-update');
// Import dynamodb from aws-sdk
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { ConditionalCheckFailedException } = require('@aws-sdk/client-dynamodb');

// This includes all tests for CreateItem handler
describe('handler::UpdateItem', function () {
  let sendSpy;

  // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
  beforeAll(() => {
    // Mock dynamodb
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname
    sendSpy = jest.spyOn(DynamoDBDocumentClient.prototype, 'send');
  });

  // Reset mocks to their original state
  afterEach(() => {
    sendSpy.mockReset();
  });

  // Clean up mocks
  afterAll(() => {
    sendSpy.mockRestore();
  });

  it('should update an item', async () => {
    const returnedItem = { Attributes: { id: 'id1', name: 'name1' } };

    // Return the specified value whenever the spied put function is called
    sendSpy.mockResolvedValue(returnedItem);

    const event = {
      httpMethod: 'PUT',
      pathParameters: {
        itemId: 'id1',
      },
      body: '{"name": "name1"}',
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    // Expect dynamodb to have been called
    expect(sendSpy).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result.body).toMatch(/name1/);
    expect(result.statusCode).toEqual(200);
  });

  it('should return status code 404 when not found', async () => {
    const returnedItem = { Attributes: { id: 'id1', name: 'name1' } };

    // Return the specified value whenever the spied put function is called
    sendSpy.mockRejectedValue(new ConditionalCheckFailedException());

    const event = {
      httpMethod: 'PUT',
      pathParameters: {
        itemId: 'id1',
      },
      body: '{"name": "name1"}',
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    // Expect dynamodb to have been called
    expect(sendSpy).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result.body).toBeUndefined();
    expect(result.statusCode).toEqual(404);
  });
});
