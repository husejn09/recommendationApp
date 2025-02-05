import express from 'express';
import { registerUser, loginUser, refreshTokenHandler, logoutUser, } from '../controllers/userController.js';
import { validateUserInput } from "../middleware/validation.js";

const router = express.Router();

// Register a new user
router.post("/register", validateUserInput, registerUser);

// Login a user
router.post("/login", loginUser);

// get user data
// router.get("/getUser", getUserData);

router.post("/refreshToken", refreshTokenHandler);

router.post("/logout", logoutUser);

export default router;