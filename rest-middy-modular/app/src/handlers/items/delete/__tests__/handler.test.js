// import module to be tested
const handler = require('../index');

// import modules to be mocked
const itemService = require('../../../../services/item-service');
jest.mock('../../../../services/item-service');

// import test fixtures
const eventFixtures = require('../../../../__fixtures__/events');

// tests for DeleteItem handler
describe('DeleteItem::handle', () => {
  afterEach(() => {
    itemService.delete.mockClear();
  });

  it('should return statusCode 204 when successful', async () => {
    itemService.delete.mockResolvedValueOnce(null);

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.deleteItem });

    const expectedResult = {
      statusCode: 204,
    };

    // Expect the service to have been called
    expect(itemService.delete).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.delete.mockRejectedValueOnce(new Error('test'));

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.deleteItem });

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
    expect(itemService.delete).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
