import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js"
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js"
import spotifyRoutes from "./routes/spotifyRoutes.js";
import tmdbRoutes from './routes/tmdbRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// testing the server with get api
app.get("/test", (req, res) =>{
    res.send("API is running");;
})

// User routes
app.use("/users", userRoutes);

// bookmark routes
app.use("/bookmarks", bookmarkRoutes);

// preferences routes
app.use("/preferences", preferenceRoutes);

// spotify routes
app.use("/api/spotify", spotifyRoutes);

// movies/series routes
app.use("/api/tmdb", tmdbRoutes);

export default app;