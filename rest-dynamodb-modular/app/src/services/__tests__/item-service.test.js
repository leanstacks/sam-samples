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

describe('ItemService::delete', () => {
  afterEach(() => {
    dynamoDb.delete.mockClear();
  });

  it('should delete an item successfully', async () => {
    // set up the test
    dynamoDb.delete.mockResolvedValueOnce(null);

    // perform the test
    const result = await service.delete(itemFixtures.savedItem.id);

    // assert the test results
    expect(result).toBeUndefined();
  });

  it('should throw the Error when a problem occurs', async () => {
    // set up the test
    const error = new Error('test');
    dynamoDb.delete.mockRejectedValueOnce(error);

    // perform the test
    // assert the test results
    await expect(service.delete(itemFixtures.savedItem.id)).rejects.toThrow('test');
  });
});

describe('ItemService::find', () => {
  afterEach(() => {
    dynamoDb.get.mockClear();
  });

  it('should find an item successfully', async () => {
    // set up the test
    dynamoDb.get.mockResolvedValueOnce({
      Item: itemFixtures.savedItem,
    });

    // perform the test
    const result = await service.find(itemFixtures.savedItem.id);

    // assert the test results
    expect(result).toEqual(itemFixtures.savedItem);
  });

  it('should throw the Error when a problem occurs', async () => {
    // set up the test
    const error = new Error('test');
    dynamoDb.get.mockRejectedValueOnce(error);

    // perform the test
    // assert the test results
    await expect(service.find(itemFixtures.savedItem.id)).rejects.toThrow('test');
  });
});

describe('ItemService::list', () => {
  afterEach(() => {
    dynamoDb.scan.mockClear();
  });

  it('should list items successfully', async () => {
    // set up the test
    dynamoDb.scan.mockResolvedValueOnce({
      Items: itemFixtures.savedItemCollection,
    });

    // perform the test
    const result = await service.list();

    // assert the test results
    expect(result).toEqual(itemFixtures.savedItemCollection);
  });

  it('should throw the Error when a problem occurs', async () => {
    // set up the test
    const error = new Error('test');
    dynamoDb.scan.mockRejectedValueOnce(error);

    // perform the test
    // assert the test results
    await expect(service.list()).rejects.toThrow('test');
  });
});
