const Movie = require('../models/movie').movieModel;
const ValidationError = require('../errors/validationError');
const ServerError = require('../errors/serverError');
const NotFoundError = require('../errors/notFoundError');
const RightsViolationError = require('../errors/rightsViolationError');
const {
  getMoviesServerMessage,
  createMovieValidationMessage,
  createMovieServerMessage,
  deleteMovieServerMessage,
  deleteMovieNotFoundMessage,
  deleteMovieRightsViolationMessage,
} = require('../variables/variables');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(() => {
      next(new ServerError(getMoviesServerMessage));
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
        next(new ValidationError(createMovieValidationMessage));
        return;
      }
      next(new ServerError(createMovieServerMessage));
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((test) => {
      if (!test) { throw new NotFoundError(); }
      if (test.owner.toString() !== req.user.id) { throw new RightsViolationError(); }
      Movie.findByIdAndDelete(req.params._id)
        .then((movie) => res.status(200).send(movie))
        .catch(() => next(new ServerError(deleteMovieServerMessage)));
    })
    .catch((error) => {
      if (error.name === 'NotFoundError') {
        next(new NotFoundError(deleteMovieNotFoundMessage));
        return;
      }
      if (error.name === 'RightsViolationError') {
        next(new RightsViolationError(deleteMovieRightsViolationMessage));
        return;
      }
      next(new ServerError(deleteMovieServerMessage));
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
