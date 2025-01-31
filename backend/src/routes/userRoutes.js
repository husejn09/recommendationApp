import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { validateUserInput } from "../middleware/validation.js";

const router = express.Router();

// Register a new user
router.post("/register", validateUserInput, registerUser);

// Login a user
router.post("/login", loginUser);

export default router;