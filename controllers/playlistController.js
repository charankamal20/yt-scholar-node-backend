const { Playlist, PlaylistUser } = require("../models/playlist");

const createPlaylist = async (req, res) => {
  const playlistData = req.body;
  const user_id = req.user.id; // assuming user_id is set in middleware
  console.log(req.user);
  // Validate YouTube URL
  if (!isValidYoutubeURL(playlistData.url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    // Create new playlist
    const playlist = new Playlist(playlistData);
    await playlist.save();

    // Update user playlists
    const userPlaylistUpdate = await PlaylistUser.findOneAndUpdate(
      { user_id },
      { $addToSet: { user_playlists: { url: playlist.url } } },
      { new: true, upsert: true }
    );

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUserPlaylists = async (req, res) => {
  const user_id = req.user.id;

  try {
    const user_playlists = await PlaylistUser.findOne({
      user_id: user_id,
    }).populate("user_playlists"); // This should refer to the virtual field, not "user_playlists.id"

    if (!user_playlists)
      return res.status(204).json({ message: "No playlists found" });

    res.status(200).json(user_playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlaylistById = async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await Playlist.findOne({ url: id });
    if (!playlist)
      return res.status(404).json({ message: "Playlist not found" });
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlaylistProgress = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const { index, status } = req.query;
  const isCompleted = status === "true";

  try {
    const userPlaylist = await PlaylistUser.findOne({ user_id });

    if (!userPlaylist)
      return res.status(404).json({ message: "User playlist not found" });

    // Update video completion status
    userPlaylist.user_playlists.forEach((pl) => {
      if (pl.url === id) {
        pl.videos[index] = isCompleted;
        pl.updatedAt = Date.now();
      }
    });

    await userPlaylist.save();
    res.status(200).json({ message: "Progress updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePlaylistById = async (req, res) => {
  const { id } = req.params;

  try {
    await Playlist.deleteOne({ url: id });
    await PlaylistUser.updateMany(
      {},
      { $pull: { user_playlists: { url: id } } }
    );
    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to validate YouTube URL
const isValidYoutubeURL = (url) => {
  return (
    url.startsWith("https://www.youtube.com") ||
    url.startsWith("https://youtube.com")
  );
};

module.exports = {
  createPlaylist,
  getAllUserPlaylists,
  getPlaylistById,
  updatePlaylistProgress,
  deletePlaylistById,
};
