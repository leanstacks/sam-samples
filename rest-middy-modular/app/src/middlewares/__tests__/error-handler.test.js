const createError = require('http-errors');

const middleware = require('../error-handler');

describe('Error Handler', () => {
  it('should return error in response', () => {
    const mw = middleware();
    const request = { error: new createError.NotFound() };

    mw.onError(request);

    const expectedResult = {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'NotFoundError',
        code: 404,
        statusCode: 404,
        message: 'Not Found',
      }),
    };

    expect(request.response).not.toBeNull();
    expect(request.response).toEqual(expectedResult);
  });

  it('should return error.code in response', () => {
    const mw = middleware();
    const error = new createError.NotFound();
    error.code = 999;
    const request = { error };

    mw.onError(request);

    const expectedResult = {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'NotFoundError',
        code: 999,
        statusCode: 404,
        message: 'Not Found',
      }),
    };

    expect(request.response).not.toBeNull();
    expect(request.response).toEqual(expectedResult);
  });

  it('should use default values when not present in error', () => {
    const mw = middleware();
    const request = { error: new Error() };

    mw.onError(request);

    const expectedResult = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Error',
        code: 500,
        statusCode: 500,
        message: 'Unhandled error',
      }),
    };

    expect(request.response).not.toBeNull();
    expect(request.response).toEqual(expectedResult);
  });

  it('should not overwrite existing response', () => {
    const mw = middleware();
    const response = { statusCode: 404, body: null };
    const request = { error: new createError.NotFound(), response };

    mw.onError(request);

    expect(request.response).toEqual(response);
  });

  it('should not log error', () => {
    const mw = middleware({ logger: undefined });
    const request = { error: new createError.NotFound() };

    mw.onError(request);

    const expectedResult = {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'NotFoundError',
        code: 404,
        statusCode: 404,
        message: 'Not Found',
      }),
    };

    expect(request.response).not.toBeNull();
    expect(request.response).toEqual(expectedResult);
  });
});
