// import module to be tested
const lambda = require('../item-list');

// import modules to be mocked
const itemService = require('../../services/item-service');
jest.mock('../../services/item-service');

// import test fixtures
const itemFixtures = require('../../__fixtures__/items');

// This includes all tests for ListItems handler
describe('ListItems::handle', () => {
  afterEach(() => {
    itemService.list.mockClear();
  });

  it('should return a list of items when successful', async () => {
    itemService.list.mockResolvedValueOnce(itemFixtures.savedItemCollection);

    const event = {
      httpMethod: 'GET',
      body: null,
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(itemFixtures.savedItemCollection),
    };

    // Expect dynamodb to have been called
    expect(itemService.list).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.list.mockRejectedValueOnce(new Error('test'));

    const event = {
      httpMethod: 'GET',
      body: null,
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 500,
      body: JSON.stringify({ name: 'Error', message: 'test' }),
    };

    // Expect dynamodb to have been called
    expect(itemService.list).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
