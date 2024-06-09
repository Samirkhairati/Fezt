import express from 'express';
const router = express.Router();
import { createOrder } from '../controllers/order.controller';
import { userAuth, vendorAuth } from '../middleware/auth.middleware';
router.route('/')
    .post(userAuth, createOrder)

export default router;
