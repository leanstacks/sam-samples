// Import all functions from get-by-id.js
const lambda = require('../../../handlers/get-by-id');
// Import dynamodb from aws-sdk
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// This includes all tests for FindItem handler
describe('handler::FindItem', () => {
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

  it('should return item when found', async () => {
    const item = { id: 'id1' };

    // Return the specified value whenever the spied function is called
    sendSpy.mockReturnValue(Promise.resolve({ Item: item }));

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        itemId: 'id1',
      },
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(item),
    };

    // Expect dynamodb to have been called
    expect(sendSpy).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return status code 404 when not found', async () => {
    const item = { id: 'id1' };

    // Return the specified value whenever the spied function is called
    sendSpy.mockReturnValue(Promise.resolve({}));

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        itemId: 'id1',
      },
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 404,
    };

    // Expect dynamodb to have been called
    expect(sendSpy).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
