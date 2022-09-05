const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const { DEV_JWT_SECRET } = require('../config.json');
const {
  AUTH_EMPTY_TOKEN_MESSAGE,
  AUTH_WRONG_TOKEN_MESSAGE,
} = require('../config.json');

const { NODE_ENV, JWT_SECRET } = process.env;

const authorization = (req, res, next) => {
  if (!req.headers.authorization) {
    next(new UnauthorizedError(AUTH_EMPTY_TOKEN_MESSAGE));
    return;
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(AUTH_WRONG_TOKEN_MESSAGE));
  }

  req.user = payload;

  next();
};

module.exports = authorization;
