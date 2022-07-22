const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflictError');
const ServerError = require('../errors/serverError');
const ValidationError = require('../errors/validationError');
const UnauthorizedError = require('../errors/unauthorizedError');

const User = require('../models/user').userModel;

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
            next(new ValidationError('Signup controller: validation error'));
            return;
          }
          if (error.name === 'MongoServerError') {
            next(new ConflictError('Signup controller: this user is already registered'));
            return;
          }
          next(new ServerError('Signup controller: server error'));
        });
    })
    .catch(() => next(new ServerError('Signup controller: server error')));
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
      const token = jwt.sign({ id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((error) => {
      if (error.name === 'UnauthorizedError') {
        next(new UnauthorizedError('Signin controller: wrong email or password'));
        return;
      }
      next(new ServerError('Signin controller: server error'));
    });
};

module.exports = { signin, signup };
