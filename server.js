const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const notesRoutes = require("./routes/notes");
const playlistRoutes = require("./routes/playlist");

const app = express();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://youtubescholar.classikh.me' : 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


app.use("/api", require("./routes/auth"));

app.use("/api", require("./routes/api"));

app.use("/api", notesRoutes);
app.use("/api/playlist", playlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
