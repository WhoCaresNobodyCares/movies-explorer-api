const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflictError');
const ServerError = require('../errors/serverError');
const ValidationError = require('../errors/validationError');
const UnauthorizedError = require('../errors/unauthorizedError');
const User = require('../models/user').userModel;

const {
  DEV_JWT_SECRET,
  SIGNUP_VALIDATION_MESSAGE,
  SIGNUP_CONFLICT_MESSAGE,
  SIGNUP_SERVER_MESSAGE,
  SIGNIN_UNAUTHORIZED_MESSAGE,
  SIGNIN_SERVER_MESSAGE,
} = require('../config.json');

const { NODE_ENV, JWT_SECRET } = process.env;

const signup = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then(() => {
          res.status(201).send({ email, name });
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new ValidationError(SIGNUP_VALIDATION_MESSAGE));
            return;
          }
          if (error.name === 'MongoServerError') {
            next(new ConflictError(SIGNUP_CONFLICT_MESSAGE));
            return;
          }
          next(new ServerError(SIGNUP_SERVER_MESSAGE));
        });
    })
    .catch(() => next(new ServerError(SIGNUP_SERVER_MESSAGE)));
};

const signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { throw new UnauthorizedError(); }
      return bcrypt.compare(password, user.password).then((match) => ({ match, user }));
    })
    .then(({ match, user }) => {
      if (!match) { throw new UnauthorizedError(); }
      const token = jwt.sign({ id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((error) => {
      if (error.name === 'UnauthorizedError') {
        next(new UnauthorizedError(SIGNIN_UNAUTHORIZED_MESSAGE));
        return;
      }
      next(new ServerError(SIGNIN_SERVER_MESSAGE));
    });
};

module.exports = { signin, signup };
