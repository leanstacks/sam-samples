// import module to be tested
const lambda = require('../item-find');

// import modules to be mocked
const itemService = require('../../services/item-service');
jest.mock('../../services/item-service');

// import test fixtures
const itemFixtures = require('../../__fixtures__/items');

// This includes all tests for FindItem handler
describe('FindItem::handle', () => {
  afterEach(() => {
    itemService.find.mockClear();
  });

  it('should return an item when successful', async () => {
    itemService.find.mockResolvedValueOnce(itemFixtures.savedItem);

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        itemId: 'a1',
      },
      body: null,
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Expect dynamodb to have been called
    expect(itemService.find).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 404 when not found', async () => {
    itemService.find.mockResolvedValueOnce(null);

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        itemId: 'a1',
      },
      body: null,
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 404,
    };

    // Expect dynamodb to have been called
    expect(itemService.find).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 400 when validation error occurs', async () => {
    const event = {
      httpMethod: 'GET',
      pathParameters: {},
      body: null,
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 400,
      body: JSON.stringify({
        name: 'ValidationError',
        message: '"pathParameters.itemId" is required',
      }),
    };

    // Expect dynamodb to have been called
    expect(itemService.find).toHaveBeenCalledTimes(0);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.find.mockRejectedValueOnce(new Error('test'));

    const event = {
      httpMethod: 'GET',
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

    // Expect dynamodb to have been called
    expect(itemService.find).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
