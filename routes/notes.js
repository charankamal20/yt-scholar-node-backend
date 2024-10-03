const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const authMiddleware = require("../middleware/auth"); // Middleware to check JWT
const cookieParser = require("cookie-parser");

// Protect routes with auth middleware
router.use(cookieParser(), authMiddleware);

// Create a note
router.post("/user", notesController.createNoteForUser); // Updated to match controller method

// Get all notes for a user
router.get("/user", notesController.getAllNotesForUser); // Correct method name

// Get notes for a user by playlist ID
router.get("/user/playlist/:id", notesController.getNotesForUserByPlaylistID); // Updated route to reflect intent

// Update a note
router.put("/user/note/:id", notesController.updateNoteText); // Updated to match controller method

// Delete a note
router.delete("/user/note/:id", notesController.deleteNoteByID); // Updated to match controller method

module.exports = router;
