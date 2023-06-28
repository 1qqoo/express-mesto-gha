const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator/lib/isURL');

const signinValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const signupValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(isURL),
  }),
});

const userIdValidate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
});

const userInfoValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const userAvatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isURL),
  }),
});

const cardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(isURL),
  }),
});

const cardIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
});

module.exports = {
  signinValidate,
  signupValidate,
  userIdValidate,
  userInfoValidate,
  userAvatarValidate,
  cardValidate,
  cardIdValidate,
};
