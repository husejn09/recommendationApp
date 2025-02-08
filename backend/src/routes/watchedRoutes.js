import express from 'express';
import { getWatched, toggleWatched } from '../controllers/watchedItemsController';

const router = express.Router();

router.post('/watched/toggle', toggleWatched);
router.get('/watched', getWatched);

export default router;