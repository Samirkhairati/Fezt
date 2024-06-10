import express from 'express';
const router = express.Router();
import { createOrder, readOrdersByUser, readOrdersByVendor } from '../controllers/order.controller';
import { userAuth, vendorAuth } from '../middleware/auth.middleware';
router.route('/')
    .post(userAuth, createOrder)

router.route('/user')
    .get(userAuth, readOrdersByUser)
router.route('/vendor')
    .get(vendorAuth, readOrdersByVendor)

export default router;
