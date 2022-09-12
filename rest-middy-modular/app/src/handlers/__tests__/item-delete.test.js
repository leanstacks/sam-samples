// import module to be tested
const lambda = require('../item-delete');

// import modules to be mocked
const itemService = require('../../services/item-service');
jest.mock('../../services/item-service');

// import test fixtures
const itemFixtures = require('../../__fixtures__/items');

// This includes all tests for FindItem handler
describe('DeleteItem::handle', () => {
  afterEach(() => {
    itemService.delete.mockClear();
  });

  it.skip('should return status code 204 when successful', async () => {
    itemService.delete.mockResolvedValueOnce(null);

    const event = {
      httpMethod: 'DELETE',
      pathParameters: {
        itemId: 'a1',
      },
      body: null,
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 204,
    };

    // Expect the service to have been called
    expect(itemService.delete).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it.skip('should return statusCode 500 when an error occurs', async () => {
    itemService.delete.mockRejectedValueOnce(new Error('test'));

    const event = {
      httpMethod: 'DELETE',
      pathParameters: {
        itemId: 'a1',
      },
      body: null,
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 500,
      body: JSON.stringify({ name: 'Error', message: 'test' }),
    };

    // Expect the service to have been called
    expect(itemService.delete).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
