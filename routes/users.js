const router = require('express').Router();
const usersController = require('../controllers/users');

module.exports = router;

router.get('/', usersController.getUsers);
router.get('/me', usersController.getUserById);
router.get('/:userId', usersController.getUserById);
router.patch('/me', usersController.updateUser);
router.patch('/me/avatar', usersController.updateUserAvatar);
