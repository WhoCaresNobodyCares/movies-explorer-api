const Movie = require('../models/movie').movieModel;
const ValidationError = require('../errors/validationError');
const ServerError = require('../errors/serverError');
const NotFoundError = require('../errors/notFoundError');
const RightsViolationError = require('../errors/rightsViolationError');
const {
  GET_MOVIES_SERVER_MESSAGE,
  CREATE_MOVIE_VALIDATION_MESSAGE,
  CREATE_MOVIE_SETVER_MESSAGE,
  DELETE_MOVIE_SERVER_MESSAGE,
  DELETE_MOVIE_NOT_FOUND_MESSAGE,
  DELETE_MOVIE_RIGHTS_VIOLATION_MESSAGE,
} = require('../config.json');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(() => {
      next(new ServerError(GET_MOVIES_SERVER_MESSAGE));
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
        next(new ValidationError(CREATE_MOVIE_VALIDATION_MESSAGE));
        return;
      }
      next(new ServerError(CREATE_MOVIE_SETVER_MESSAGE));
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((test) => {
      if (!test) { throw new NotFoundError(); }
      if (test.owner.toString() !== req.user.id) { throw new RightsViolationError(); }
      Movie.findByIdAndDelete(req.params._id)
        .then((movie) => res.status(200).send(movie))
        .catch(() => next(new ServerError(DELETE_MOVIE_SERVER_MESSAGE)));
    })
    .catch((error) => {
      if (error.name === 'NotFoundError') {
        next(new NotFoundError(DELETE_MOVIE_NOT_FOUND_MESSAGE));
        return;
      }
      if (error.name === 'RightsViolationError') {
        next(new RightsViolationError(DELETE_MOVIE_RIGHTS_VIOLATION_MESSAGE));
        return;
      }
      next(new ServerError(DELETE_MOVIE_SERVER_MESSAGE));
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
