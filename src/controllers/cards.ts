import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';
import { STATUS_OK, STATUS_CREATED } from '../utils/constants';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS_OK).json(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const newCard = await Card.create({ name, link, owner });
    return res.status(STATUS_CREATED).json(newCard);
  } catch (err) {
    return next(err);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner.toString() !== userId.toString()) {
      throw new ForbiddenError('Нет прав на удаление чужой карточки');
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (err) {
    return next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.status(STATUS_OK).json(updatedCard);
  } catch (err) {
    return next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.status(STATUS_OK).json(updatedCard);
  } catch (err) {
    return next(err);
  }
};
