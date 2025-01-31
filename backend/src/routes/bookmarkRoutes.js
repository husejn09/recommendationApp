import express from "express";
import { createBookmark, removeBookmark, getAllBookmarks } from "../controllers/bookmarkController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { validateBookmark } from "../middleware/validation.js";

const router = express.Router();

// Insert bookmarks
router.post("/insertBookmark", authenticateUser, validateBookmark, createBookmark);

// Remove bookmarks
router.post("/removeBookmark", authenticateUser, validateBookmark, removeBookmark);

// Get all bookmarks
router.get("/:user_id", authenticateUser, getAllBookmarks);

export default router;