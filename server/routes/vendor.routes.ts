import express from 'express';
import { createVendor, loginVendor, logoutVendor } from '../controllers/vendor.controller';
const router = express.Router();

router.route('/')
    .post(createVendor)

router.route('/login')
    .post(loginVendor)

router.route('/logout')
    .post(logoutVendor)

export default router;
