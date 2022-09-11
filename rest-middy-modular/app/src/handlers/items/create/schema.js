/**
 * A JSON Schema to validate the request event.
 */
exports.eventSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Full name' },
      },
      required: ['name'],
    },
  },
};
