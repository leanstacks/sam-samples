// import module to be tested
const handler = require('../index');

// import modules to be mocked
const itemService = require('../../../../services/item-service');
jest.mock('../../../../services/item-service');

// import test fixtures
const eventFixtures = require('../../../../__fixtures__/events');
const itemFixtures = require('../../../../__fixtures__/items');

// This includes all tests for ListItems handler
describe('ListItems::handle', () => {
  afterEach(() => {
    itemService.list.mockClear();
  });

  it('should return a list of items when successful', async () => {
    itemService.list.mockResolvedValueOnce(itemFixtures.savedItemCollection);

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.listItems });

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(itemFixtures.savedItemCollection),
    };

    // Expect the service to have been called
    expect(itemService.list).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.list.mockRejectedValueOnce(new Error('test'));

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.listItems });

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
    expect(itemService.list).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
