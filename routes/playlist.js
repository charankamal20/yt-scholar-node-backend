const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware to check JWT
const cookieParser = require("cookie-parser");
const {
  createPlaylist,
  getAllUserPlaylists,
  getPlaylistById,
  updatePlaylistProgress,
  deletePlaylistById,
} = require("../controllers/playlistController");

const router = express.Router();

// Protect routes with auth middleware
router.use(cookieParser(), authMiddleware);

router.post("/", createPlaylist);
router.get("/", getAllUserPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id/progress", updatePlaylistProgress);
router.delete("/:id", deletePlaylistById);

module.exports = router;
