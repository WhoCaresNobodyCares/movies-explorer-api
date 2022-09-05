const User = require('../models/user').userModel;
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const ServerError = require('../errors/serverError');
const ValidationError = require('../errors/validationError');
const {
  GET_USER_NOT_FOUND_MESSAGE,
  GET_USER_SERVER_MESSAGE,
  CHANGE_USER_CONFLICT_MESSAGE,
  CHANGE_USER_VALIDATION_MESSAGE,
  CHANGE_USER_SERVER_MESSAGE,
} = require('../config.json');

const getUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((error) => {
      if (error.name === 'NotFoundError') {
        next(new NotFoundError(GET_USER_NOT_FOUND_MESSAGE));
        return;
      }
      next(new ServerError(GET_USER_SERVER_MESSAGE));
    });
};

function changeUser(req, res, next) {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user.id, { email, name }, { runValidators: true, new: true })
    .then((user) => {
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((error) => {
      if (error.name === 'MongoServerError') {
        next(new ConflictError(CHANGE_USER_CONFLICT_MESSAGE));
        return;
      }
      if (error.name === 'ValidationError') {
        next(new ValidationError(CHANGE_USER_VALIDATION_MESSAGE));
        return;
      }
      next(new ServerError(CHANGE_USER_SERVER_MESSAGE));
    });
}

module.exports = { getUser, changeUser };
