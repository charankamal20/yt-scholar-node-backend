const mongoose = require("mongoose");

const UserPlaylistSchema = new mongoose.Schema({
  PlaylistId: String,
  IsCompleted: Boolean,
  UpdatedAt: Date,
  CreatedAt: Date,
  Progress: Number,
  Videos: [Boolean],
});

const PlaylistUserSchema = new mongoose.Schema({
  UserId: { type: Number, required: true },
  UserPlaylists: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UserPlaylist" },
  ],
});

// Create a virtual field for user_playlists
PlaylistUserSchema.virtual("user_playlists", {
  ref: "UserPlaylist", // the model to use
  localField: "UserPlaylists", // the field from the PlaylistUser schema
  foreignField: "_id", // the field from the UserPlaylist schema that you want to populate
  justOne: false, // set to true if you want to return a single document
});

// Ensure virtual fields are serialized
PlaylistUserSchema.set("toObject", { virtuals: true });
PlaylistUserSchema.set("toJSON", { virtuals: true });

const PlaylistUser = mongoose.model("PlaylistUser", PlaylistUserSchema);
const UserPlaylist = mongoose.model("UserPlaylist", UserPlaylistSchema);

module.exports = { PlaylistUser, UserPlaylist }; // Exporting both models
