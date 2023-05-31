const router = require('express').Router();
const cardsController = require('../controllers/cards');

module.exports = router;

router.get('/', cardsController.getCards);
router.post('/', cardsController.createCard);
router.delete('/:cardId', cardsController.deleteCard);
router.put('/:cardId/likes', cardsController.likeCard);
router.delete('/:cardId/likes', cardsController.dislikeCard);

module.exports = router;
