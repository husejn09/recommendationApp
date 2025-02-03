import express from "express";
import { createPreferences, removePreferences, getAllPreferences } from "../controllers/preferenceController.js";
import { validatePreferences } from "../middleware/validation.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new preference
router.post("/insertPreferences", validatePreferences, authenticateUser, createPreferences);

// Remove preference
router.post("/removePreference", authenticateUser, removePreferences);

// Get all preferences
router.get("/getPreferences", authenticateUser, getAllPreferences);

export default router;