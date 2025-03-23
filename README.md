# Recommendation App

A mobile app that provides recommendations for movies and TV series based on the user's genre preferences. Users can choose between movie or series recommendations, discover new movies/series, bookmark them, and keep track of their favourite genres, watched movies/series, and those in progress.

## Features

- **Movie/Series Recommendations**:
  - Users can select genre and mood for movie/series recommendations, with options for new or old releases.
  - Recommendations are influenced by public information available through the **TMDB API**.

- **User Authentication**:
  - Users can log in to save their preferences and track their bookmarks using **PostgreSQL**.

## Tech Stack

- **Frontend**: 
  - **React Native** for building the mobile app
  - **NativeWind** for utility-first styling (tailwind in React Native)
  - **React Navigation** for app navigation
  - **React Native Paper** for UI components
  - **Expo** for development and build tools

- **Backend**: 
  - **Node.js** with **Express.js** for API development
  - **PostgreSQL** for user authentication and saved data
  - **TMDB API** for movie and TV series recommendations
  - **JWT** for user authentication

- **Deployment**:
  - Backend is hosted and deployed on **Render** with the PostgreSQL database also hosted on Render.

## Installation

### Prerequisites

- Node.js and npm (or Yarn)
- Expo CLI (for running and building React Native apps)
- PostgreSQL database setup for user authentication

### Steps to Run Locally

### 1. Clone the repository:
   ```bash
   git clone https://github.com/husejn09/recommendationApp.git
   cd recommendationApp
```

### 2. Install dependencies for both frontend and backend:

#### For Frontend (React Native):
```
cd frontend
npm install
```

#### For Backend (Node.js + Express):
```
cd backend
npm install
```
### 3. Set up environment variables:

* Create a .env file in the backend folder and add the required API keys (TMDB API, etc.).
* Configure your PostgreSQL connection settings in the .env file.

### 4. Run the backend server:
```
cd backend
npm start
```
### 5. Run the frontend app using Expo:
```
cd frontend
npm start
```
### 6. Open the Expo app on your phone or use an emulator to scan the QR code and test the app.

## Usage

Upon opening the app, users can sign in or sign up to save their preferences and bookmark recommendations.
After logging in, users can select Movies or Series for personalized recommendations based on mood and genre.
Users can view movie/series recommendations, save their favorites, and track their watched or in-progress items.

## Demo video

[![Project Overview Watch Demo](https://img.youtube.com/vi/zGpDK_3ftWw/0.jpg)](https://www.youtube.com/watch?v=zGpDK_3ftWw) 

## Contributing

Feel free to fork this repository, submit issues, or create pull requests for improvements or bug fixes. Contributions are welcome!

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Known Issues
* The app currently does not support offline recommendations.
* Movie recommendations may be slow at times due to API rate limits.
* The app on the first load might be slow beacuse of the server sleeping state.

## Future Improvements
- Add search functionality for specific movies/TV shows or searching by your favourite actor.
- Implement push notifications for new recommendations based on user preferences.

## Acknowledgments
- Thanks to [TMDB API](https://www.themoviedb.org/) for providing the movie/TV show data.
- Thanks to [Render](https://render.com/) for hosting the backend.
