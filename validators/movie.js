const { celebrate, Joi } = require('celebrate');

const createMovieValidation = celebrate({
  body: {
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/).required(),
    trailerLink: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/).required(),
    thumbnail: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  },
});

const deleteMovieValidation = celebrate({
  params: {
    _id: Joi.string().length(24).hex().required(),
  },
});

module.exports = {
  createMovieValidation,
  deleteMovieValidation,
};
