const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS - restrict origin in production for security
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// ---- Explicitly mount each API router ----
app.use("/api/worship", require("./routes/worship"));

app.use("/api/prayers", require("./routes/prayer"));        // prayer.js
app.use("/api/quran", require("./routes/quran"));
app.use("/api/activities/habit", require("./routes/habit"));
app.use("/api/achievements", require("./routes/achievements"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dhikr", require("./routes/dhikr"));
app.use("/api/imaan", require("./routes/imaan"));
app.use("/api/user", require("./routes/user"));



// Test base endpoint
app.get("/", (req, res) => {
  res.send("Deen Companion API is running!");
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ msg: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
