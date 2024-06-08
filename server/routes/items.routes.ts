import express from 'express';
const router = express.Router();
import { createItem, updateItem, deleteItem, readItems, readItemsByVendor } from '../controllers/item.controller';
import { vendorAuth } from '../middleware/auth.middleware';
router.route('/')
    .post(vendorAuth, createItem)
    .get(vendorAuth, readItems)
    .put(vendorAuth, updateItem)
    .delete(vendorAuth, deleteItem)

router.route('/vendor').get(vendorAuth, readItemsByVendor)

export default router;
