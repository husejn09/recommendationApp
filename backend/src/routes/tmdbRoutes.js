import express from 'express';
import { movieRecommendations, seriesRecommendations, movieGenres, seriesGenres } from '../controllers/tmdbController.js';

const router = express.Router();

// Route to get movie recommendations.
router.post('/movies', movieRecommendations);

// Route to get TV series recommendations.
router.post('/series', seriesRecommendations);

// Route to get available movie genres
router.get('/genres', movieGenres);

// Route to get available tv shows genres
router.get('/genres', seriesGenres);

export default router;
