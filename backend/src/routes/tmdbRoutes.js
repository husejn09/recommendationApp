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

router.get('/series/:id', async (req, res) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${req.params.id}`,
        { params: { api_key: process.env.TMDB_API_KEY } }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
