const defaults = {
  logger: console.log,
};

const ioLoggerMiddleware = (opts = {}) => {
  const { logger } = {
    ...defaults,
    ...opts,
  };

  const logEvent = (event) => {
    try {
      logger(`event::${JSON.stringify(event)}`);
    } catch (e) {}
  };

  const logResponse = (response) => {
    try {
      if (response === undefined) return;
      logger(`response::${response.statusCode}::${response.body}`);
    } catch (e) {}
  };

  const ioLoggerMiddlewareBefore = (request) => {
    logEvent(request.event);
  };

  const ioLoggerMiddlewareAfter = (request) => {
    logResponse(request.response);
  };

  const ioLoggerMiddlewareOnError = (request) => {
    logResponse(request.response);
  };

  return {
    before: ioLoggerMiddlewareBefore,
    after: ioLoggerMiddlewareAfter,
    onError: ioLoggerMiddlewareOnError,
  };
};

module.exports = ioLoggerMiddleware;
