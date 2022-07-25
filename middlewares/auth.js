const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const { DEV_JWT_SECRET } = require('../config.json');
const { authEmptyTokenMessage, authWrongTokenMessage } = require('../variables/variables');

const { NODE_ENV, JWT_SECRET } = process.env;

const authorization = (req, res, next) => {
  if (!req.headers.authorization) {
    next(new UnauthorizedError(authEmptyTokenMessage));
    return;
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(authWrongTokenMessage));
  }

  req.user = payload;

  next();
};

module.exports = authorization;
