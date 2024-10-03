const { default: mongoose } = require("mongoose");
const { UserNotes } = require("../models/note"); // Adjust the path as necessary

// Create a new note for a user
const createNoteForUser = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in the request
  const { video_id, playlist_id, note_text, title, timestamp } = req.body;

  const note = {
    note_id: new mongoose.Types.ObjectId().toString(), // Generate a unique note_id
    video_id,
    playlist_id,
    note_text,
    title,
    timestamp,
  };

  try {
    const userNotes = await UserNotes.findOne({ user_id: userId });

    if (!userNotes) {
      // Create a new UserNotes entry if none exists
      const newUserNotes = new UserNotes({
        user_id: userId,
        notes: [note],
      });
      await newUserNotes.save();
      return res.status(201).json(newUserNotes);
    } else {
      // If the UserNotes entry exists, add the new note
      userNotes.notes.push(note);
      await userNotes.save();
      return res.status(200).json(userNotes);
    }
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all notes for a user
const getAllNotesForUser = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in the request

  try {
    const userNotes = await UserNotes.findOne({ user_id: userId });
    if (!userNotes) {
      return res.status(404).json({ message: "No notes found for this user" });
    }
    return res.status(200).json(userNotes.notes);
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get notes for a user by playlist ID
const getNotesForUserByPlaylistID = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in the request
  const playlistID = req.params.id;

  try {
    const userNotes = await UserNotes.findOne({ user_id: userId });
    if (!userNotes) {
      return res.status(404).json({ message: "No notes found for this user" });
    }

    // Filter notes by playlistID
    const filteredNotes = userNotes.notes.filter(
      (note) => note.playlist_id === playlistID
    );
    return res.status(200).json(filteredNotes);
  } catch (error) {
    console.error("Error retrieving notes by playlist ID:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update a note's text by note ID
const updateNoteText = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in the request
  const noteId = req.params.id;
  const { note_text } = req.body;

  try {
    const userNotes = await UserNotes.findOne({ user_id: userId });
    if (!userNotes) {
      return res.status(404).json({ message: "No notes found for this user" });
    }

    // Find the note by ID
    const noteIndex = userNotes.notes.findIndex(
      (note) => note.note_id === noteId
    );
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note text
    userNotes.notes[noteIndex].note_text = note_text;
    await userNotes.save();

    return res
      .status(200)
      .json({
        message: "Note updated successfully",
        note: userNotes.notes[noteIndex],
      });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete a note by ID
const deleteNoteByID = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in the request
  const noteId = req.params.id;

  try {
    const userNotes = await UserNotes.findOne({ user_id: userId });
    if (!userNotes) {
      return res.status(404).json({ message: "No notes found for this user" });
    }

    // Find the note index by ID
    const noteIndex = userNotes.notes.findIndex(
      (note) => note.note_id === noteId
    );
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Remove the note from the array
    userNotes.notes.splice(noteIndex, 1);
    await userNotes.save();

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createNoteForUser,
  getAllNotesForUser,
  getNotesForUserByPlaylistID,
  updateNoteText,
  deleteNoteByID,
};
