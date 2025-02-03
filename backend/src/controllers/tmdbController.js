import { getMovieRecommendations, getSeriesRecommendations, getMoviesGenres, getSeriesGenres } from '../services/tmdbServices.js';

export const movieRecommendations = async (req, res) => {
  try {
    const { genre, mood } = req.body; 
    const movies = await getMovieRecommendations(genre, mood);
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const seriesRecommendations = async (req, res) => {
  try {
    const { genre, mood } = req.body;
    const series = await getSeriesRecommendations(genre, mood);
    res.status(200).json({ series });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const movieGenres = async (req, res) => {
    try {
      const genres = await getMoviesGenres();
      res.status(200).json({ genres });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const seriesGenres = async (req, res) => {
    try {
        const genres = await getSeriesGenres();
        res.status(200).json({ genres });
    } catch (error) {
        res.status(500).josn({ error: error.message })
    }
}