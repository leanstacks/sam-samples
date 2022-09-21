const createError = require('http-errors');

const validateDefaults = {
  abortEarly: false,
  allowUnknown: true,
};

const defaults = {
  eventSchema: undefined,
  responseSchema: undefined,
  validateOptions: {},
};

const validatorMiddleware = (opts = {}) => {
  const { eventSchema, responseSchema, validateOptions } = {
    ...defaults,
    ...opts,
  };

  const validate = (schema, obj) => {
    const options = { ...validateDefaults, ...validateOptions };

    return schema.validate(obj, options);
  };

  const validatorMiddlewareBefore = (request) => {
    if (eventSchema) {
      const { value, error } = validate(eventSchema, request.event);
      if (error) {
        throw error;
      }
      request.event = {
        ...request.event,
        ...value,
      };
    }
  };

  const validatorMiddlewareAfter = (request) => {
    if (responseSchema) {
      const { value, error } = validate(eventSchema, request.response);
      if (error) {
        throw error;
      }
    }
  };

  return {
    before: validatorMiddlewareBefore,
    after: validatorMiddlewareAfter,
  };
};

module.exports = validatorMiddleware;
