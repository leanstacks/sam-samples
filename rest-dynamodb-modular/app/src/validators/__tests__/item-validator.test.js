const validator = require('../item-validator');

const eventFixtures = require('../../__fixtures__/events');

describe('ItemValidator::validateItemCreate', () => {
  it('should return a validated event when successful', () => {
    const result = validator.validateItemCreate(eventFixtures.createItem);

    expect(result).not.toBeNull();
    expect(result.body.name).toEqual('name1');
  });
});

describe('ItemValidator::validateItemUpdate', () => {
  it('should return a validated event when successful', () => {
    const result = validator.validateItemUpdate(eventFixtures.updateItem);

    expect(result).not.toBeNull();
    expect(result.pathParameters.itemId).toEqual('id1');
    expect(result.body.name).toEqual('name1');
  });
});

describe('ItemValidator::validateItemDelete', () => {
  it('should return a validated event when successful', () => {
    const result = validator.validateItemDelete(eventFixtures.deleteItem);

    expect(result).not.toBeNull();
    expect(result.pathParameters.itemId).toEqual('id1');
  });
});

describe('ItemValidator::validateItemList', () => {
  it('should return a validated event when successful', () => {
    const result = validator.validateItemList(eventFixtures.listItems);

    expect(result).not.toBeNull();
  });
});

describe('ItemValidator::validateItemFind', () => {
  it('should return a validated event when successful', () => {
    const result = validator.validateItemFind(eventFixtures.findItem);

    expect(result).not.toBeNull();
    expect(result.pathParameters.itemId).toEqual('id1');
  });
});
