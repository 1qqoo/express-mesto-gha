const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

module.exports = router;

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res
    .status(404)
    .send({ message: `Страницы по адресу ${req.baseUrl} не существует` });
});
