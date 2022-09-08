const Joi = require('joi');
const ValidationError = require('../../errors/validation-error');

const { validate } = require('../validator');

describe('validator::validate', () => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  it('should return a validated object when successful', () => {
    const obj = {
      name: 'Bob',
    };

    const result = validate(schema, obj);

    expect(result).not.toBeNull();
    expect(result.name).toEqual('Bob');
  });

  it('should throw a ValidationError when not valid', () => {
    const obj = {
      name: 1,
    };

    function doValidate() {
      validate(schema, obj);
    }

    expect(doValidate).toThrow(ValidationError);
  });
});
