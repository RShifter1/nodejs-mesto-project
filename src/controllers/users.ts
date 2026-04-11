import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Некорректный _id' });
      }
    }
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).json(newUser);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
    }
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(updatedUser);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
    }
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(updatedUser);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
    }
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};
