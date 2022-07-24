const router = require('express').Router();
const { getUser, changeUser } = require('../controllers/user');
const { changeUserValidation } = require('../validators/user');

router.get('/users/me', getUser);
router.patch('/users/me', changeUserValidation, changeUser);

module.exports = router;
