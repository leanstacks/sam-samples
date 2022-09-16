// import module to be tested
const handler = require('../index');

// import modules to be mocked
const itemService = require('../../../../services/item-service');
jest.mock('../../../../services/item-service');

// import test fixtures
const eventFixtures = require('../../../../__fixtures__/events');
const itemFixtures = require('../../../../__fixtures__/items');

// tests for CreateItem handler
describe('CreateItem::handle', () => {
  afterEach(() => {
    itemService.create.mockClear();
  });

  it('should return createditem when successful', async () => {
    itemService.create.mockResolvedValueOnce(itemFixtures.savedItem);

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.createItem });

    const expectedResult = {
      statusCode: 201,
      body: JSON.stringify(itemFixtures.savedItem),
    };

    // Expect the service to have been called
    expect(itemService.create).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });

  it('should return statusCode 400 when a validation error  occurs', async () => {
    const invalidEvent = { ...eventFixtures.createItem };
    invalidEvent.body = JSON.stringify({});

    // Invoke the handler
    const result = await handler.handle(invalidEvent);

    const expectedResult = {
      statusCode: 400,
    };

    // Expect the service to have been called
    expect(itemService.create).toHaveBeenCalledTimes(0);
    // Compare the result with the expected result
    expect(result.statusCode).toEqual(expectedResult.statusCode);
    expect(result.body).toEqual('Event object failed validation');
  });

  it('should return statusCode 500 when an error occurs', async () => {
    itemService.create.mockRejectedValueOnce(new Error());

    // Invoke the handler
    const result = await handler.handle({ ...eventFixtures.createItem });

    // Expect the service to have been called
    expect(itemService.create).toHaveBeenCalledTimes(1);
    // Compare the result with the expected result
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual('Unhandled error');
  });
});
