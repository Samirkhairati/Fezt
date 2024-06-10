import express from 'express';
import { createVendor, loginVendor, logoutVendor, readVendors, getVendor } from '../controllers/vendor.controller';
const router = express.Router();

router.route('/')
    .post(createVendor)
    .get(readVendors)

router.route('/login')
    .post(loginVendor)

router.route('/logout')
    .post(logoutVendor)

router.route('/profile')
    .get(getVendor)

export default router;
