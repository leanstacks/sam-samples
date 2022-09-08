exports.createItem = {
  httpMethod: 'POST',
  body: '{"name": "name1"}',
};

exports.updateItem = {
  httpMethod: 'PUT',
  pathParameters: {
    itemId: 'id1',
  },
  body: '{"name": "name1"}',
};

exports.deleteItem = {
  httpMethod: 'DELETE',
  pathParameters: {
    itemId: 'id1',
  },
  body: null,
};

exports.listItems = {
  httpMethod: 'GET',
  body: null,
};

exports.findItem = {
  httpMethod: 'GET',
  pathParameters: {
    itemId: 'id1',
  },
  body: null,
};
