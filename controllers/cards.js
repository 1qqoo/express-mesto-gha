const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ err: err.message, stack: err.stack });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel
    .create({
      name,
      link,
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.card_id)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при удалении карточки.',
        });
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.card_id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Передан несуществующий id карточки.' });
      }
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.card_id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Передан несуществующий id карточки.' });
      }
      res.status(201).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные для снятии лайка.' });
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
