const router = require('express').Router();
const usersController = require('../controllers/users');

module.exports = router;

router.get('/', usersController.getUsers);

router.get('/:_id', usersController.getUserById);
router.post('/', usersController.createUser);
router.patch('/me', usersController.updateUser);
router.patch('/me/avatar', usersController.updateUserAvatar);
