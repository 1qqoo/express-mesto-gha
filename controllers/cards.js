const { ValidationError, CastError } = require('mongoose').Error;
const cardModel = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');
const {
  InaccurateDataError,
  NotFoundError,
  NotPermissionError,
} = require('../errors/errors');

const getCards = (req, res, next) => {
  cardModel
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel
    .create({
      name,
      link,
      owner,
    })
    .then((card) => res.status(ERROR_CODE.CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(
          new InaccurateDataError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new NotPermissionError('Нельзя трогать чужие карточки');
      }
      card.deleteOne().then(() => {
        res.status(ERROR_CODE.OK).send({
          message:
            'Спасибо что воспользовались моими услугами и удалили карточку, которую я любил',
        });
      });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(
          new InaccurateDataError(
            'Переданы некорректные данные при удалении карточки',
          ),
        );
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        return next(
          new InaccurateDataError('Передан несуществующий id карточки'),
        );
      }
      return next(err);
    });
};

// const dislikeCard = (req, res) => {
//   cardModel
//     .findByIdAndUpdate(
//       req.params.cardId,
//       { $pull: { likes: req.user._id } },
//       { new: true },
//     )
//     .then((card) => {
//       if (!card) {
//         res
//           .status(ERROR_CODE.NOT_FOUND)
//           .send({ message: 'Передан несуществующий id карточки.' });
//       } else {
//         res.send({ card });
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res
//           .status(ERROR_CODE.BAD_REQUEST)
//           .send({ message: 'Переданы некорректные данные для снятии лайка.' });
//       } else {
//         res.status(ERROR_CODE.SERVER_ERROR).send({
//           message: err.message,
//         });
//       }
//     });
// };

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  // dislikeCard,
};
