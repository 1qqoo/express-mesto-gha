const router = require('express').Router();
const cardsController = require('../controllers/cards');

module.exports = router;

router.get('/', cardsController.getCards);
router.post('/', cardsController.createCard);
router.delete('/:card_id', cardsController.deleteCard);
router.put('/:card_id/likes', cardsController.likeCard);
router.delete('/:card_id/likes', cardsController.dislikeCard);

module.exports = router;
