const middleware = require('../io-logger');

const eventFixtures = require('../../__fixtures__/events');

describe('IO Logger', () => {
  let logger = jest.fn();

  afterEach(() => {
    logger.mockClear();
  });

  it('should log event before', () => {
    const mw = middleware({ logger });

    mw.before({ event: eventFixtures.createItem });

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith(`event::${JSON.stringify(eventFixtures.createItem)}`);
  });

  it('should log response after', () => {
    const mw = middleware({ logger });

    const response = { statusCode: 200, body: JSON.stringify({ name: 'Bob' }) };

    mw.after({ response });

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith(
      `response::${response.statusCode}::${JSON.stringify(response)}`,
    );
  });

  it('should not log if response is undefined', () => {
    const mw = middleware({ logger });

    const response = undefined;

    mw.after({ response });

    expect(logger).toHaveBeenCalledTimes(0);
  });

  it('should log response on error', () => {
    const mw = middleware({ logger });

    const response = { statusCode: 500, body: JSON.stringify({ message: 'Uh oh' }) };

    mw.onError({ response });

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith(
      `response::${response.statusCode}::${JSON.stringify(response)}`,
    );
  });
});
