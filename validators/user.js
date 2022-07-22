const { celebrate, Joi } = require('celebrate');

const changeUserValidation = celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  },
});

module.exports = {
  changeUserValidation,
};
