import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// testing the server with get api
app.get("/test", (req, res) =>{
    res.send("API is running");;
})

export default app;