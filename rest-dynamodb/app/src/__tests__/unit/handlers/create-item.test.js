// Import all functions from create-item.js
const lambda = require('../../../handlers/create-item');
// Import dynamodb from aws-sdk
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// This includes all tests for CreateItem handler
describe('handler::CreateItem', function () {
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

  it('should create an item', async () => {
    const returnedItem = { id: 'id1', name: 'name1' };

    // Return the specified value whenever the spied put function is called
    sendSpy.mockReturnValue(Promise.resolve(returnedItem));

    const event = {
      httpMethod: 'POST',
      body: '{"name": "name1"}',
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    // Expect dynamodb to have been called
    expect(sendSpy).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result.body).toMatch(/name1/);
    expect(result.statusCode).toEqual(201);
  });
});
