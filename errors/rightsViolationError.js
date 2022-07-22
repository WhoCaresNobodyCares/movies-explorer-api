class RightsViolationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RightsViolationError';
    this.statusCode = 403;
  }
}

module.exports = RightsViolationError;
