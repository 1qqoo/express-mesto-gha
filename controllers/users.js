const userModel = require('../models/user');
const { ERROR_CODE } = require('../utils/constants');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(ERROR_CODE.OK).send(users);
    })
    .catch(() => {
      res.status(ERROR_CODE.SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
      } else if (err.message === 'NotFound') {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel
    .create({
      name,
      about,
      avatar,
    })
    .then((user) => {
      res.status(ERROR_CODE.CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
