import express from 'express';
const router = express.Router();
import { createClub, readClubs, updateClub, deleteClub } from '../controllers/club.controller';

router.route('/')
    .post(createClub)
    .get(readClubs)
    .put(updateClub)
    .delete(deleteClub)

export default router;
