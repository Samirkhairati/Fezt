import express from 'express';
import { createUser, loginUser, logoutUser } from '../controllers/user.controller';
const router = express.Router();

router.route('/')
    .post(createUser)

router.route('/login')
    .post(loginUser)

router.route('/logout')
    .post(logoutUser)

export default router;
