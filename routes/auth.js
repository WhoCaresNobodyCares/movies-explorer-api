const router = require('express').Router();
const { signup, signin } = require('../controllers/auth');
const { signupValidation, signinValidation } = require('../validators/auth');

router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);

module.exports = router;
