import express from 'express';
const router = express.Router();
import { createEvent, readEvents, updateEvent, deleteEvent, readEventsByUser, registerEvent } from '../controllers/event.controller';
import { userAuth } from '../middleware/auth.middleware';
router.route('/')
    .post(userAuth, createEvent)
    .get(userAuth, readEvents)
    .put(userAuth, updateEvent)
    .delete(userAuth, deleteEvent)

router.route('/register').put(userAuth, registerEvent)
router.route('/club').get(userAuth, readEventsByUser)

export default router;
