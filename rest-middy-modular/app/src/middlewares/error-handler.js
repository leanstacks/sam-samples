const { normalizeHttpResponse } = require('@middy/util');

const defaults = {
  defaultMessage: 'Unhandled error',
  defaultStatusCode: 500,
  logger: console.error,
};

const errorHandlerMiddleware = (opts = {}) => {
  const options = {
    ...defaults,
    ...opts,
  };

  const errorHandlerMiddlewareOnError = (request) => {
    // if response is written, do nothing
    if (request.response !== undefined) return;

    const { name, code, statusCode = options.defaultStatusCode, message } = request.error;

    if (typeof options.logger === 'function') {
      options.logger(`error::name::${name}::statusCode::${statusCode}::message::${message}`);
    }

    normalizeHttpResponse(request);
    request.response = {
      ...request.response,
      statusCode,
      body: JSON.stringify({
        name,
        code: code ? code : statusCode,
        statusCode,
        message: message ? message : options.defaultMessage,
      }),
      headers: {
        ...request.response.headers,
        'Content-Type': 'application/json',
      },
    };
  };

  return {
    onError: errorHandlerMiddlewareOnError,
  };
};

module.exports = errorHandlerMiddleware;
