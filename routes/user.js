const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, changeUser } = require('../controllers/user');

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  },
}), changeUser);

module.exports = router;
