// import the module to be tested
const service = require('../item-service');

//  import modules to be mocked
const dynamoDb = require('../../utils/dynamodb');
jest.mock('../../utils/dynamodb');

// import test fixtures
const itemFixtures = require('../../__fixtures__/items');
const ValidationError = require('../../errors/validation-error');

describe('ItemService::create', () => {
  afterEach(() => {
    dynamoDb.put.mockClear();
  });

  it('should create an item successfully', async () => {
    // set up the test
    dynamoDb.put.mockResolvedValueOnce(null);

    // perform the test
    const result = await service.create(itemFixtures.unsavedItem);

    // assert the test results
    expect(result).not.toBeNull();
    expect(result.id).not.toBeNull();
    expect(result.name).toEqual('Bob');
    expect(result.createdAt).not.toBeNull();
  });

  it('should throw a ValidationError when the identifier is in use', async () => {
    // set up the test
    const error = new Error('test');
    error.name = 'ConditionalCheckFailedException';
    dynamoDb.put.mockRejectedValueOnce(error);

    // perform the test
    // assert the test results
    await expect(service.create(itemFixtures.unsavedItem)).rejects.toThrow(ValidationError);
  });

  it('should re-throw the Error when a problem occurs', async () => {
    // set up the test
    const error = new Error('test');
    dynamoDb.put.mockRejectedValueOnce(error);

    // perform the test
    // assert the test results
    await expect(service.create(itemFixtures.unsavedItem)).rejects.toThrow('test');
  });
});

describe('ItemService::update', () => {
  afterEach(() => {
    dynamoDb.update.mockClear();
  });

  it('should update an item successfully', async () => {
    // set up the test
    dynamoDb.update.mockResolvedValueOnce({
      Attributes: itemFixtures.savedItem,
    });

    // perform the test
    const result = await service.update(itemFixtures.savedItem.id, itemFixtures.savedItem);

    // assert the test results
    expect(result).toEqual(itemFixtures.savedItem);
  });

  it('should return null when not found', async () => {
    // set up the test
    const error = new Error('test');
    error.name = 'ConditionalCheckFailedException';
    dynamoDb.update.mockRejectedValueOnce(error);

    // perform the test
    const result = await service.update(itemFixtures.savedItem.id, itemFixtures.savedItem);

    // assert the test results
    expect(result).toBeNull();
  });

  it('should re-throw the Error when a problem occurs', async () => {
    // set up the test
    const error = new Error('test');
    dynamoDb.update.mockRejectedValueOnce(error);

    // perform the test
    // assert the test results
    await expect(service.update(itemFixtures.savedItem.id, itemFixtures.savedItem)).rejects.toThrow(
      'test',
    );
  });
});
