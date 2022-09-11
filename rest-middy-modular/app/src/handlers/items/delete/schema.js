/**
 * A JSON Schema to validate the request event.
 */
exports.eventSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        itemId: { type: 'string', description: 'Item identifier' },
      },
      required: ['itemId'],
    },
  },
};
