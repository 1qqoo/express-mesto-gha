const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

module.exports = router;

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) =>
  next(new NotFoundError('Ресурс не найден')),
);
