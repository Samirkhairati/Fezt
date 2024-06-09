import express from 'express';
import { createVendor, loginVendor, logoutVendor, readVendors } from '../controllers/vendor.controller';
const router = express.Router();

router.route('/')
    .post(createVendor)
    .get(readVendors)

router.route('/login')
    .post(loginVendor)

router.route('/logout')
    .post(logoutVendor)

export default router;
