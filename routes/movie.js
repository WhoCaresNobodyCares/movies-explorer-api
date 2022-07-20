const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', createMovie);
router.delete('/_id', deleteMovie);

module.exports = router;
