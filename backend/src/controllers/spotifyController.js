
import { redirectToSpotifyAuth, handleSpotifyCallback, getMusicRecommendations, refreshAccessToken, getTopArtists, getTopTracks, getRelatedArtists } from "../services/spotifyServices.js";

export const redirectToSpotify = (req, res) => {
    redirectToSpotifyAuth(req, res);
}


export const handleSpotifyCallBack = async (req, res) => {
    handleSpotifyCallback(req, res);
}


export const getMusicRecommendation = async (req, res) => {
    let { access_token, refresh_token, genres } = req.body;

    try {
        const topArtists = await getTopArtists(access_token);
        const topTracks = await getTopTracks(access_token);

        console.log("Top Artists IDs:", topArtists);
        console.log("Top Tracks IDs:", topTracks);
        console.log("Genres:", genres);

        const recommendations = await getMusicRecommendations(
            access_token,
            genres,
            topArtists,
            topTracks
        );

        res.status(200).json({ recommendations });

    } catch (error) {
        console.log("Full error object:", error);
        
        if (error.response?.status === 401) { // Use status code instead of message
            try {
                const newAccessToken = await refreshAccessToken(refresh_token);
                const topArtists = await getTopArtists(newAccessToken);
                const topTracks = await getTopTracks(newAccessToken);

                const recommendations = await getMusicRecommendations(
                    newAccessToken,
                    genres,
                    topArtists,
                    topTracks
                );

                return res.status(200).json({ 
                    access_token: newAccessToken,
                    recommendations 
                });
            } catch (refreshError) {
                console.error("Refresh error:", refreshError);
                return res.status(500).json({ 
                    error: "Failed to refresh token and fetch recommendations" 
                });
            }
        }
        
        // Handle Spotify API errors properly
        if (error.response?.data?.error) {
            return res.status(error.response.status).json({
                error: `Spotify API Error: ${error.response.data.error.message}`
            });
        }

        return res.status(500).json({ 
            error: error.message || "Unknown error occurred" 
        });
    }
};

