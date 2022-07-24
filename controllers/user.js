const User = require('../models/user').userModel;
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const ServerError = require('../errors/serverError');
const ValidationError = require('../errors/validationError');
const {
  getUserNotFoundMessage,
  getUserServerMessage,
  changeUserConflictMessage,
  changeUserValidationMessage,
  changeUserServerMessage,
} = require('../variables/variables');

const getUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((error) => {
      if (error.name === 'NotFoundError') {
        next(new NotFoundError(getUserNotFoundMessage));
        return;
      }
      next(new ServerError(getUserServerMessage));
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
        next(new ConflictError(changeUserConflictMessage));
        return;
      }
      if (error.name === 'ValidationError') {
        next(new ValidationError(changeUserValidationMessage));
        return;
      }
      next(new ServerError(changeUserServerMessage));
    });
}

module.exports = { getUser, changeUser };
