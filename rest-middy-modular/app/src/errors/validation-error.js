/**
 * `ValidationError` objects are thrown when the supplied input argument does
 * not match the expected or required value.
 */
class ValidationError extends Error {
  /**
   * Creates a new `ValidationError` object.
   * @param {string} message Error message.
   * @param {[number]} statusCode (Optional) Error status code. Default: 400
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

module.exports = ValidationError;
