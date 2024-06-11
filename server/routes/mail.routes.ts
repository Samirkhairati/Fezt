import express from 'express';
import { mailTest } from '../controllers/mail.controller';
const router = express.Router();

router.route('/').post(mailTest)

export default router;
