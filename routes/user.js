const router = require('express').Router();
const { getUser, changeUser } = require('../controllers/user');
const { changeUserValidation } = require('../validators/user');

router.get('/me', getUser);
router.patch('/me', changeUserValidation, changeUser);

module.exports = router;
