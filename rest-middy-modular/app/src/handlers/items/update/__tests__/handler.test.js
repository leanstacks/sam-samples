// import module to be tested
const handler = require('../index');

// import modules to be mocked
const itemService = require('../../../../services/item-service');
jest.mock('../../../../services/item-service');

// import test fixtures
const eventFixtures = require('../../../../__fixtures__/events');
const itemFixtures = require('../../../../__fixtures__/items');

// tests for UpdatItem handler
describe('UpdateItem::handle', () => {
  afterEach(() => {
    itemService.update.mockClear();
  });

  it('should return an updated item when successful', async () => {
    itemService.update.mockResolvedValueOnce(itemFixtures.savedItem);

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.updateItem });

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Expect the service to have been called
    expect(itemService.update).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 404 when not found', async () => {
    itemService.update.mockResolvedValueOnce(null);

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.updateItem });

    const expectedResult = {
      statusCode: 404,
    };

    // Expect the service to have been called
    expect(itemService.update).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result.statusCode).toEqual(expectedResult.statusCode);
  });

  it('should return statusCode 400 when a validation error occurs', async () => {
    const invalidEvent = { ...eventFixtures.updateItem };
    invalidEvent.body = JSON.stringify({});

    // Invoke the handler
    const result = await handler.handle(invalidEvent);

    const expectedResult = {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'EventValidationError',
        code: 400,
        statusCode: 400,
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

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.updateItem });

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
    expect(itemService.update).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
