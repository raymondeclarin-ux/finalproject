// api/index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🎉 Event Management API is running!");
});

// Sample /api/events
let events = [
  { id: 1, name: "Tech Conference 2025", date: "2025-12-01", venue: "NEU Auditorium" },
];

app.get("/api/events", (req, res) => res.json(events));

// Export function for Vercel
module.exports = app;
