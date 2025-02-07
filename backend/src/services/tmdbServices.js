import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL;

 // Get movie recommendations based on a genre and mood.

export const getMoviesGenres = async () => {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: {
            api_key: TMDB_API_KEY,
        },
    });

    return response.data.genres;
}

export const getSeriesGenres = async () => {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
        params: {
            api_key: TMDB_API_KEY,
        },
    });

    return response.data.genres;
        // 10759 - action 
        // 80 - crime
        // 9648 - mystery
        // 37 - western 
}

const transformMovie = (movie, genresMapping) => {
    
    const movieGenreNames = (movie.genre_ids || [])
      .map(id => genresMapping[id])
      .filter(Boolean);
  
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';

    return {
      id: movie.id,
      title: movie.title,
      genres: movieGenreNames,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
      releaseYear,
      rating: movie.vote_average,
      overview: movie.overview
    };
  };


  export const getMovieRecommendations = async (genre, mood) => {
    
    let params = {
      api_key: TMDB_API_KEY,
      with_genres: genre,
      'vote_average.gte': 6,
      page: 3
    };
   
    if (mood === 'happy') {
      params['vote_average.gte'] = 7;
    } else if (mood === 'sad') {
      params['vote_average.lte'] = 5;
    }
  
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
    const movies = response.data.results;
  
    const genresList = await getMoviesGenres();
    const genresMapping = genresList.reduce((acc, genreObj) => {
      acc[genreObj.id] = genreObj.name;
      return acc;
    }, {});
  
    // Transform each movie to only include the desired fields
    return movies.map(movie => transformMovie(movie, genresMapping));
  };


 // Get series (TV shows) recommendations based on a genre and mood.

 export const getSeriesRecommendations = async (genre, mood) => {
    let params = {
      api_key: TMDB_API_KEY,
      with_genres: genre,
      'vote_average.gte': 6, // average rating more than this value
      page: 3
    };
  
    if (mood === 'happy') {
      params['vote_average.gte'] = 7;
    } else if (mood === 'sad') {
      params['vote_average.lte'] = 6;
    }
  
    const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, { params });
    const series = response.data.results;
  
    const genresList = await getSeriesGenres();
    const genresMapping = genresList.reduce((acc, genreObj) => {
      acc[genreObj.id] = genreObj.name;
      return acc;
    }, {});
    
    // filtering only series with overview
    const filteredSeries = series.filter(serie => serie.overview && serie.overview.trim() !== '');



    // Transform each series
    return filteredSeries.map(serie => {
        const serieGenreNames = (serie.genre_ids || [])
          .map(id => genresMapping[id])
          .filter(Boolean);
        const releaseYear = serie.first_air_date ? serie.first_air_date.split('-')[0] : '';
        return {
          id: serie.id,
          name: serie.name,
          genres: serieGenreNames,
          poster: serie.poster_path ? `${TMDB_IMAGE_BASE_URL}${serie.poster_path}` : null,
          releaseYear,
          rating: serie.vote_average,
          overview: serie.overview
        };

      });
  };
