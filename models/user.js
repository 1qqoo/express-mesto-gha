const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isURL, isEmail } = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      required: [true, 'Поле "about" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    avatar: {
      type: String,
      default: 'Ссылка',
      required: [true, 'Поле "avatar" должно быть заполнено'],
      validate: isURL,
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: isEmail,
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function loginUser(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
    });
};
module.exports = mongoose.model('user', userSchema);
