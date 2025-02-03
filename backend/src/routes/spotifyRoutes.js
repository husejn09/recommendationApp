import express from "express";
import { redirectToSpotify, handleSpotifyCallBack, getMusicRecommendation } from "../controllers/spotifyController.js";

const router = express.Router();

// Redirect users to Spotify to authorize
router.get("/auth", redirectToSpotify);

// Spotify callback to app route
router.get("/callback", handleSpotifyCallBack);

// Get music recommendations
router.post("/recommendations", getMusicRecommendation);

export default router;