import { Request, Response } from 'express';
import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
} from '../utils/constants';

export interface IError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
) => {
  const { statusCode = STATUS_INTERNAL_SERVER_ERROR, message } = err;

  if (err.code === 11000) {
    return res.status(STATUS_CONFLICT).json({ message: 'Пользователь с таким email уже существует' });
  }

  if (err.name === 'ValidationError') {
    return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
  }

  if (err.name === 'CastError') {
    return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный формат идентификатора' });
  }

  if (statusCode === STATUS_FORBIDDEN) {
    return res.status(STATUS_FORBIDDEN).json({ message });
  }

  return res.status(statusCode).json({
    message: statusCode === STATUS_INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
};
