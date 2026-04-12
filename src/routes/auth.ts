import { Router } from 'express';
import { validateSignin, validateSignup } from '../middlewares/validation';

import { createUser, login } from '../controllers/users';

const router = Router();

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

export default router;
