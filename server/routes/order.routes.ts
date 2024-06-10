import express from 'express';
const router = express.Router();
import { createOrder, readOrdersByUser } from '../controllers/order.controller';
import { userAuth, vendorAuth } from '../middleware/auth.middleware';
router.route('/')
    .post(userAuth, createOrder)

router.route('/user')
    .get(userAuth, readOrdersByUser)

export default router;
