const Movie = require('../models/movie').movieModel;
const ValidationError = require('../errors/validationError');
const ServerError = require('../errors/serverError');
const NotFoundError = require('../errors/notFoundError');
const RightsViolationError = require('../errors/rightsViolationError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(() => {
      next(new ServerError('GetMovies controller: server error'));
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner = req.user.id,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError('CreateMovie controller: validation error'));
        return;
      }
      next(new ServerError('CreateMovie controller: server error'));
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((test) => {
      if (!test) { throw new NotFoundError(); }
      if (test.owner.toString() !== req.user.id) { throw new RightsViolationError(); }
      Movie.findByIdAndDelete(req.params._id)
        .then((movie) => res.status(200).send(movie))
        .catch(() => next(new ServerError('DeleteMovie controller: server error')));
    })
    .catch((error) => {
      if (error.name === 'NotFoundError') {
        next(new NotFoundError('DeleteMovie controller: the movie is not found'));
        return;
      }
      if (error.name === 'RightsViolationError') {
        next(new RightsViolationError('DeleteMovie controller: it is not your movie to delete'));
        return;
      }
      next(new ServerError('DeleteMovie controller: server error'));
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
