const cardModel = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.status(ERROR_CODE.OK).send(cards);
    })
    .catch((err) => {
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: err.message });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel
    .create({
      name,
      link,
      owner,
    })
    .then((card) => {
      res.status(ERROR_CODE.CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel
    .findById(req.params.cardId)
    .orFail(() => {
      res
        .status(ERROR_CODE.NOT_FOUND)
        .send({ message: 'Карточка с указанным id не найдена.' });
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        res.status(ERROR_CODE.FORBIDDEN).send({
          message: 'Нельзя трогать чужие карточки',
        });
      }
      card.deleteOne().then(() => {
        res.status(ERROR_CODE.OK).send({
          message:
            'Спасибо что воспользовались моими услугами и удалили карточку, которую я любил',
        });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при удалении карточки.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: err.message,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для снятии лайка.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: err.message,
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
