const router = require('express').Router();
const usersController = require('../controllers/users');
const {
  userAvatarValidate,
  userInfoValidate,
  userIdValidate,
} = require('../middlewares/validation');

module.exports = router;

router.get('/', usersController.getUsers);
router.get('/me', usersController.getUserById);
router.get('/:userId', userIdValidate, usersController.getUserById);
router.patch('/me', userInfoValidate, usersController.updateUser);
router.patch(
  '/me/avatar',
  userAvatarValidate,
  usersController.updateUserAvatar,
);
