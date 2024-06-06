import express from 'express';
const router = express.Router();
import { createClub, readClubs, updateClub, deleteClub } from '../controllers/club.controller';
import { userAuth } from '../middleware/auth.middleware';
router.route('/')
    .post(userAuth, createClub)
    .get(userAuth, readClubs)
    .put(userAuth, updateClub)
    .delete(userAuth, deleteClub)

export default router;
