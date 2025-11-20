const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Example route
app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Export handler for Vercel
module.exports = app;
module.exports = app; // Vercel uses the default export as handler