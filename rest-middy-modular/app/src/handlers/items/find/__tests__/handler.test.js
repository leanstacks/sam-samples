// import module to be tested
const handler = require('../index');

// import modules to be mocked
const itemService = require('../../../../services/item-service');
jest.mock('../../../../services/item-service');

// import test fixtures
const eventFixtures = require('../../../../__fixtures__/events');
const itemFixtures = require('../../../../__fixtures__/items');

// tests for FindItem handler
describe('FindItem::handle', () => {
  afterEach(() => {
    itemService.find.mockClear();
  });

  it('should return an item when successful', async () => {
    itemService.find.mockResolvedValueOnce(itemFixtures.savedItem);

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.findItem });

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Expect the service to have been called
    expect(itemService.find).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 404 when not found', async () => {
    itemService.find.mockResolvedValueOnce(null);

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.findItem });

    const expectedResult = {
      statusCode: 404,
    };

    // Expect the service to have been called
    expect(itemService.find).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result.statusCode).toEqual(expectedResult.statusCode);
  });

  it('should return statusCode 400 when a validation error occurs', async () => {
    const invalidEvent = { ...eventFixtures.findItem };
    invalidEvent.pathParameters = {};

    // Invoke the handler
    const result = await handler.handle(invalidEvent);

    const expectedResult = {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'BadRequestError',
        code: 400,
        statusCode: 400,
        message: 'Event object failed validation',
      }),
    };

    // Expect the service to have been called
    expect(itemService.find).toHaveBeenCalledTimes(0);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.find.mockRejectedValueOnce(new Error('test'));

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.findItem });

    const expectedResult = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Error',
        code: 500,
        statusCode: 500,
        message: 'test',
      }),
    };

    // Expect the service to have been called
    expect(itemService.find).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
