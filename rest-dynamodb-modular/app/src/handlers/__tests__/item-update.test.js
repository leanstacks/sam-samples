// import module to be tested
const lambda = require('../item-update');

//import modules to be mocked
const itemService = require('../../services/item-service');
jest.mock('../../services/item-service');

// import test fixtures
const itemFixtures = require('../../__fixtures__/items');

// This includes all tests for UpdateItem handler
describe('UpdateItem::handle', function () {
  afterEach(() => {
    itemService.update.mockClear();
  });

  it('should return updated item when successful', async () => {
    itemService.update.mockResolvedValueOnce(itemFixtures.savedItem);

    const event = {
      httpMethod: 'PUT',
      pathParameters: {
        itemId: 'id1',
      },
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Expect the service to have been called
    expect(itemService.update).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return status code 404 when not found', async () => {
    itemService.update.mockResolvedValueOnce(null);

    const event = {
      httpMethod: 'PUT',
      pathParameters: {
        itemId: 'id1',
      },
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 404,
    };

    // Expect the service to have been called
    expect(itemService.update).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 400 when validation error occurs', async () => {
    const event = {
      httpMethod: 'PUT',
      pathParameters: {
        itemId: 'id1',
      },
      body: JSON.stringify({}),
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 400,
      body: JSON.stringify({
        name: 'ValidationError',
        message: '"body.name" is required',
      }),
    };

    // Expect the service to have been called
    expect(itemService.update).toHaveBeenCalledTimes(0);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.update.mockRejectedValueOnce(new Error('test'));

    const event = {
      httpMethod: 'PUT',
      pathParameters: {
        itemId: 'id1',
      },
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 500,
      body: JSON.stringify({ name: 'Error', message: 'test' }),
    };

    // Expect the service to have been called
    expect(itemService.update).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
