const router = require('express').Router();
const { getUser, changeUser } = require('../controllers/user');

router.get('/me', getUser);
router.patch('/me', changeUser);

module.exports = router;
