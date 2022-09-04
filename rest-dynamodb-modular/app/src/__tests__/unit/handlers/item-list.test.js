// Import all functions from list-items.js
const lambda = require('../../../handlers/item-list');
// Import dynamodb from aws-sdk
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// This includes all tests for ListItems handler
describe('handler::ListItems', () => {
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

  it('should return a list of items', async () => {
    const items = [{ id: 'id1' }, { id: 'id2' }];

    // Return the specified value whenever the spied function is called
    sendSpy.mockResolvedValue({ Items: items });

    const event = {
      httpMethod: 'GET',
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(items),
    };

    // Expect dynamodb to have been called
    expect(sendSpy).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
