require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// ===== Event Model =====
const EventSchema = new mongoose.Schema({
  name: String,
  date: String,
  venue: String
});

const Event = mongoose.model("Event", EventSchema);

// ===== ROUTES =====
app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// ===== Vercel Export =====
module.exports = app;

