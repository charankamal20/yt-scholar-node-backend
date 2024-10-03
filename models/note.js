// noteModel.js
const mongoose = require("mongoose");

// Define the note schema
const noteSchema = new mongoose.Schema({
  note_id: { type: String, required: true, unique: true },
  video_id: { type: String, required: true },
  playlist_id: { type: String, required: true },
  note_text: { type: String, required: true },
  title: { type: String, required: true },
  timestamp: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },

  updated_at: { type: Date, default: Date.now },
});
// Define the UserNotes schema
const userNotesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  notes: {
    type: [noteSchema], // Use an array of noteSchema
    required: true, // Optional: Ensure that notes are required
  },
});

// Create models
const Note = mongoose.model("Note", noteSchema);
const UserNotes = mongoose.model("UserNotes", userNotesSchema);

module.exports = { Note, UserNotes };
