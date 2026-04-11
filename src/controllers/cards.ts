import { Request, Response } from 'express';

import {
  STATUS_OK,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
} from '../utils/constants';

import Card from '../models/card';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.status(STATUS_OK).json(cards);
  } catch (err) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = (req).user._id;
  try {
    const newCard = await Card.create({ name, link, owner });
    return res.status(STATUS_CREATED).json(newCard);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
      }
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  try {
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Карточка не найдена' });
    }
    return res.status(STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный _id' });
      }
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = (req).user._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!updatedCard) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Карточка не найдена' });
    }
    return res.status(STATUS_OK).json(updatedCard);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный _id карточки' });
      }
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = (req).user._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!updatedCard) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Карточка не найдена' });
    }
    return res.status(STATUS_OK).json(updatedCard);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный _id карточки' });
      }
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};
