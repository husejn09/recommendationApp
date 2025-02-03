import axios from "axios";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URL= process.env.SPOTIFY_REDIRECT_URL;

// function to redirect user to the Spotify for authorization
export const redirectToSpotifyAuth = (req, res) => {
    const scope = "playlist-read-private playlist-read-collaborative user-top-read playlist-modify-private playlist-modify-public";
    const queryParams = new URLSearchParams({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URL
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
}

// function to handle spotify call back
export const handleSpotifyCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Authorization code missing" });
    }

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URL,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;

        res.status(200).json({ access_token, refresh_token, expires_in }); // both refresh and access token, so when access expires refresh token is there
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getMusicRecommendations = async (access_token, genres, topArtists, topTracks) => {
    try {
        // Combine seeds (max 5 total)
        const seeds = [];
        
        // Add artists (max 2)
        if (topArtists?.length > 0) {
            seeds.push(...topArtists.slice(0, 2).map(id => ({ type: 'artist', id })));
        }
        
        // Add tracks (max 2)
        if (topTracks?.length > 0) {
            seeds.push(...topTracks.slice(0, 2).map(id => ({ type: 'track', id })));
        }

        // Ensure we don't exceed 5 seeds
        const finalSeeds = seeds.slice(0, 5);

        // Group seeds by type
        const seedParams = {
            seed_artists: finalSeeds.filter(s => s.type === 'artist').map(s => s.id).join(','),
            seed_genres: genres,
            seed_tracks: finalSeeds.filter(s => s.type === 'track').map(s => s.id).join(',')
        };


        console.log("Final seed parameters:", seedParams);

        const response = await axios.get("https://api.spotify.com/v1/recommendations", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                ...seedParams
                //market: 'BA'
            },
        });
        return response.data.tracks;
    } catch (error) {
        console.log("Spotify API Error Details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

export const getTopArtists = async (access_token) => {
    const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        params: {
            limit: 2, 
        },
    });
    return response.data.items.map(artist => artist.id);
};

export const getTopTracks = async (access_token) => {
    const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        params: {
            limit: 2,
        },
    });
    return response.data.items.map(track => track.id);
};

export const getRelatedArtists = async (access_token, artistId) => {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return response.data.artists.map(artist => artist.id);
};

// function to refresh the token, check if the access token is expireed. If it is then refresh it 
export const refreshAccessToken = async (refresh_token) => {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refresh_token,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.access_token; 
    } catch (error) {
        throw new Error("Failed to refresh access token");
    }
};
