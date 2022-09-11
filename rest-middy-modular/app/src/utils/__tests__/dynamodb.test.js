const dynamoDb = require('../dynamodb');

describe('DynamoDB', () => {
  let mockSend = jest.fn();

  beforeAll(() => {
    dynamoDb.client.send = mockSend;
  });

  afterEach(() => {
    mockSend.mockClear();
  });

  it('should put item successfully', async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await dynamoDb.put({
      TableName: 'SampleTable',
      Item: { id: 'id1' },
    });

    expect(result).toEqual({});
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should update item successfully', async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await dynamoDb.update({
      TableName: 'SampleTable',
      Key: { id: 'id1' },
      UpdateExpression: 'set #nm = :nm, updatedAt = :ua',
      ConditionExpression: 'id = :iid',
      ExpressionAttributeNames: {
        '#nm': 'name',
      },
      ExpressionAttributeValues: {
        ':iid': 'id1',
        ':nm': 'Bob',
        ':ua': '2022-09-08T20:11:00.987Z',
      },
      ReturnValues: 'ALL_NEW',
    });

    expect(result).toEqual({});
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should delete item successfully', async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await dynamoDb.delete({
      TableName: 'SampleTable',
      Key: {
        id: 'id1',
      },
    });

    expect(result).toEqual({});
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should get item successfully', async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await dynamoDb.get({
      TableName: 'SampleTable',
      Key: {
        id: 'id1',
      },
    });

    expect(result).toEqual({});
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should scan table successfully', async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await dynamoDb.scan({
      TableName: 'SampleTable',
    });

    expect(result).toEqual({});
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe('DynamoDB configuration', () => {
  // save the original environment values
  const originalEnvironment = process.env;

  beforeEach(() => {
    // remove modules from cache
    jest.resetModules();
    // initialize the environment by copying original environment
    process.env = {
      ...originalEnvironment,
    };
  });

  afterAll(() => {
    // remove modules from cache after completing all tests
    jest.resetModules();
    // restore the original environment
    process.env = originalEnvironment;
  });

  it('should configure client for running locally', () => {
    // update environment variables
    process.env.AWS_SAM_LOCAL = 'true';

    // module cache emptied, requiring the module will reload environment
    const dynamoDbClient = require('../dynamodb');

    expect(dynamoDbClient.clientConfig.endpoint).toEqual('http://dynamodb:8000');
  });
});
