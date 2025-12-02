import express from 'express';
import { registerUser, loginUser, getUser, logoutUser } from '../controllers/usercontroller.js';
import { createChat, addMessage, getUserChats, getChatById, deleteChat, getCommunityImages } from '../controllers/chatcontroller.js';
import { Protect } from '../middlewares/auth.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/user', Protect, getUser);
userRoutes.post('/logout', Protect, logoutUser);
userRoutes.post('/createChat', Protect, createChat);
userRoutes.post('/addMessage', Protect, addMessage);
userRoutes.get('/getUserChats', Protect, getUserChats);
userRoutes.get('/getChatById/:id', Protect, getChatById);
userRoutes.delete('/deleteChat/:id', Protect, deleteChat);
userRoutes.get('/getCommunityImages', Protect, getCommunityImages);

export default userRoutes;