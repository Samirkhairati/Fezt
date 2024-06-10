import express from 'express';
import { createUser, loginUser, logoutUser, getUser } from '../controllers/user.controller';
const router = express.Router();

router.route('/')
    .post(createUser)
    .get(getUser)

router.route('/login')
    .post(loginUser)

router.route('/logout')
    .post(logoutUser)

export default router;
