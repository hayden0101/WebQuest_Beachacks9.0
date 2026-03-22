const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/', userController.signup);
router.post('/login', userController.login);
router.get('/:id', userController.getUser);

module.exports = router;