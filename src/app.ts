import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  (req).user = {
    _id: new mongoose.Types.ObjectId('69da24728f1baed543bf359b'),
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
