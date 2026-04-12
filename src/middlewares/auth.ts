import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';

const { JWT_SECRET = 'secret-key' } = process.env;

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = { _id: new mongoose.Types.ObjectId(payload._id) };
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};

export default auth;
