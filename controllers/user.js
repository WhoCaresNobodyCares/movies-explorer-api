const User = require('../models/user').userModel;
const NotFoundError = require('../errors/notFoundError');
const ServerError = require('../errors/serverError');
const ValidationError = require('../errors/validationError');

const getUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) { throw new NotFoundError(); }
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((error) => {
      if (error.name === 'NotFoundError') {
        next(new NotFoundError('GetUser controller: user is not found'));
        return;
      }
      next(new ServerError('GetUser controller: server error'));
    });
};

function changeUser(req, res, next) {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user.id, { email, name }, { runValidators: true, new: true })
    .then((user) => {
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError('ChangeUser controller: validation error'));
        return;
      }
      next(new ServerError('ChangeUser controller: server error'));
    });
}

module.exports = { getUser, changeUser };
