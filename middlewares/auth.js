const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const authorization = (req, res, next) => {
  if (!req.headers.authorization) {
    next(new UnauthorizedError('Auth middleware: empty authorization token'));
    return;
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError('Auth middleware: wrong authorization token'));
  }

  req.user = payload;

  next();
};

module.exports = authorization;
