exports.createItem = {
  headers: {
    'Content-Type': 'application/json',
  },
  httpMethod: 'POST',
  body: JSON.stringify({
    name: 'name1',
  }),
};

exports.updateItem = {
  headers: {
    'Content-Type': 'application/json',
  },
  httpMethod: 'PUT',
  pathParameters: {
    itemId: 'id1',
  },
  body: '{"name": "name1"}',
};

exports.deleteItem = {
  headers: {
    'Content-Type': 'application/json',
  },
  httpMethod: 'DELETE',
  pathParameters: {
    itemId: 'id1',
  },
  body: null,
};

exports.listItems = {
  headers: {
    'Content-Type': 'application/json',
  },
  httpMethod: 'GET',
  body: null,
};

exports.findItem = {
  headers: {
    'Content-Type': 'application/json',
  },
  httpMethod: 'GET',
  pathParameters: {
    itemId: 'id1',
  },
  body: null,
};
