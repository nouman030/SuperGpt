import express from 'express';
import { registerUser, loginUser, getUser, logoutUser } from '../controllers/usercontroller.js';
import { Protect } from '../middlewares/auth.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/user', Protect, getUser);
userRoutes.post('/logout', Protect, logoutUser);

export default userRoutes;