import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js"
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js"
import spotifyRoutes from "./routes/spotifyRoutes.js";
import tmdbRoutes from './routes/tmdbRoutes.js';
import { rateLimit } from 'express-rate-limit'
import watchedRoutes from './routes/watchedRoutes.js'

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, 
    max: 20, 
  }); 


const app = express();

app.use(express.json());
app.use(cors({
    origin: '*', 
    methods: ['POST', 'GET']
}));
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

// wathced routes
app.use("/media", watchedRoutes);

export default app;