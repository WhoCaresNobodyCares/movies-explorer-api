const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { createMovieValidation, deleteMovieValidation } = require('../validators/movie');

router.get('/movies/', getMovies);
router.post('/movies/', createMovieValidation, createMovie);
router.delete('/movies/:_id', deleteMovieValidation, deleteMovie);

module.exports = router;
