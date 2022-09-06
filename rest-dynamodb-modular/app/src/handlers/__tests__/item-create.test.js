// Import all functions from create-item.js
const lambda = require('../item-create');

// import modules to be mocked
const itemService = require('../../services/item-service');
jest.mock('../../services/item-service');

// import test fixtures
const itemFixtures = require('../../__fixtures__/items');

// This includes all tests for CreateItem handler
describe('CreateItem::handle', function () {
  afterEach(() => {
    itemService.create.mockClear();
  });

  it('should return created item when successful', async () => {
    itemService.create.mockResolvedValueOnce(itemFixtures.savedItem);

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(itemFixtures.unsavedItem),
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 201,
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Expect dynamodb to have been called
    expect(itemService.create).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.create.mockRejectedValueOnce(new Error('test'));

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(itemFixtures.unsavedItem),
    };

    // Invoke the handler
    const result = await lambda.handle(event);

    const expectedResult = {
      statusCode: 500,
      body: JSON.stringify({ name: 'Error', message: 'test' }),
    };

    // Expect the service to have been called
    expect(itemService.create).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
