const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { cardIdValidate, cardValidate } = require('../middlewares/validation');

module.exports = router;

router.get('/', cardsController.getCards);
router.post('/', cardValidate, cardsController.createCard);
router.delete('/:cardId', cardIdValidate, cardsController.deleteCard);
router.put('/:cardId/likes', cardIdValidate, cardsController.likeCard);
router.delete('/:cardId/likes', cardIdValidate, cardsController.likeCard);

module.exports = router;
