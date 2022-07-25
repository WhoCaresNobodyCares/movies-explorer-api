const { celebrate, Joi } = require('celebrate');

const changeUserValidation = celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  },
});

module.exports = {
  changeUserValidation,
};
