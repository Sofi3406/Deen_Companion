const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for frontend development and credentials
app.use(
  cors({
    origin: "http://localhost:5173", // Restrict to frontend dev origin
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// Parse incoming JSON requests (MUST be above all api routes)
app.use(express.json());

// ---------- API Routers ----------
app.use("/api/worship", require("./routes/worship"));        // worship.js
app.use("/api/prayers", require("./routes/prayer"));         // prayer.js
app.use("/api/quran", require("./routes/quran"));            // quran.js
app.use("/api/activities/habit", require("./routes/habit")); // habit.js
app.use("/api/achievements", require("./routes/achievements"));
app.use("/api/auth", require("./routes/auth"));              // auth.js
app.use("/api/dhikr", require("./routes/dhikr"));            // dhikr.js
app.use("/api/imaan", require("./routes/imaan"));            // imaan.js
app.use("/api/user", require("./routes/user"));   
app.use('/api/reminders', require('./routes/reminders'));
           // user.js

// Root test endpoint
app.get("/", (req, res) => {
  res.send("Deen Companion API is running!");
});

// --- Centralized Error Handling ---
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ msg: "Internal server error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
