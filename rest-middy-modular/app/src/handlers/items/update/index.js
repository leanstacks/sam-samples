const { middyfy } = require('../../middyfy');

const { handler } = require('./handler');
const { eventSchema } = require('./schema');

/**
 * The middleware-wrapped handler function which is invoked by AWS.
 */
exports.handle = middyfy({ handler, eventSchema });
