const Joi = require('joi');

const middleware = require('../validator');

const eventFixtures = require('../../__fixtures__/events');

describe('Validator', () => {
  const eventSchema = Joi.object({
    pathParameters: Joi.object({
      itemId: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().required(),
    }),
  });

  const responseSchema = Joi.object({
    statusCode: Joi.number().min(100).max(511).required(),
    body: Joi.object({
      name: Joi.string().required(),
    }),
  });

  const event = {
    headers: {
      'Content-Type': 'application/json',
    },
    httpMethod: 'PUT',
    pathParameters: {
      itemId: 'id1',
    },
    body: {
      name: 'name1',
    },
  };

  const response = {
    statusCode: 200,
    body: JSON.stringify({ id: 'id1', name: 'name1' }),
  };

  it('should validate event successfully', () => {
    const mw = middleware({ eventSchema });
    const request = { event };

    mw.before(request);

    expect(request.event).toEqual(event);
  });

  it('should throw error on invalid event', () => {
    const mw = middleware({ eventSchema });
    const invalidEvent = { ...event };
    invalidEvent.body.name = 1;
    const request = { event: invalidEvent };

    const validate = () => {
      mw.before(request);
    };

    expect(validate).toThrow();
  });

  it('should skip event validation when no schema', () => {
    const mw = middleware({});
    const request = { event };

    mw.before(request);

    expect(request).toEqual(request);
  });

  it('should validate response successfully', () => {
    const mw = middleware({ responseSchema });
    const request = { event };

    mw.after(request);

    expect(request).toEqual(request);
  });

  it('should skip response validation when no schema', () => {
    const mw = middleware();
    const request = { response };

    mw.after(request);

    expect(request).toEqual(request);
  });

  it('should throw error on invalid response', () => {
    const mw = middleware({ responseSchema });
    const invalidResponse = { ...response };
    invalidResponse.statusCode = 999;
    const request = { response: invalidResponse };

    const validate = () => {
      mw.after(request);
    };

    expect(validate).toThrow();
  });
});
