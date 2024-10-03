// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
    default: Date.now,
  },
  xp: {
    type: Number,
    default: 0,
  },
  video_streak: {
    type: Number,
    default: 0,
  },
  attendance_streak: {
    type: Number,
    default: 1,
  },
  level: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("User", userSchema);
