// =====================================
// Event Management API (MongoDB Version)
// Express + Mongoose + Swagger
// =====================================

require("dotenv").config(); // must be first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(helmet());
app.use(express.json());

// ===== MongoDB Models =====

// Event Model
const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true }
});
const Event = mongoose.model("Event", EventSchema);

// Attendee Model
const AttendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }
});
const Attendee = mongoose.model("Attendee", AttendeeSchema);

// Organizer Model
const OrganizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true }
});
const Organizer = mongoose.model("Organizer", OrganizerSchema);

// ===== Swagger Setup =====
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Management API",
      version: "1.0.0",
      description: "Event, Attendee, Organizer API using MongoDB Atlas"
    }
  },
  apis: ["./server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ===== EVENT ROUTES =====

// 1. GET all events
app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// 2. GET event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch {
    res.status(400).json({ message: "Invalid event ID" });
  }
});

// 3. POST create event
app.post("/api/events", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. PUT update event
app.put("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch {
    res.status(400).json({ message: "Invalid event ID" });
  }
});

// 5. PATCH event
app.patch("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch {
    res.status(400).json({ message: "Invalid event ID" });
  }
});

// 6. DELETE event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch {
    res.status(400).json({ message: "Invalid event ID" });
  }
});

// ===== ATTENDEE ROUTES =====

// 7. GET all attendees
app.get("/api/attendees", async (req, res) => {
  const attendees = await Attendee.find().populate("eventId");
  res.json(attendees);
});

// 8. GET attendee by ID
app.get("/api/attendees/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id).populate("eventId");
    if (!attendee) return res.status(404).json({ message: "Attendee not found" });
    res.json(attendee);
  } catch {
    res.status(400).json({ message: "Invalid attendee ID" });
  }
});

// 9. POST create attendee
app.post("/api/attendees", async (req, res) => {
  try {
    const attendee = await Attendee.create(req.body);
    res.status(201).json(attendee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 10. DELETE attendee
app.delete("/api/attendees/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndDelete(req.params.id);
    if (!attendee) return res.status(404).json({ message: "Attendee not found" });
    res.json({ message: "Attendee removed" });
  } catch {
    res.status(400).json({ message: "Invalid attendee ID" });
  }
});

// ===== ORGANIZER ROUTES =====

// 11. GET all organizers
app.get("/api/organizers", async (req, res) => {
  const organizers = await Organizer.find();
  res.json(organizers);
});

// 12. GET organizer by ID
app.get("/api/organizers/:id", async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).json({ message: "Organizer not found" });
    res.json(organizer);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// 13. POST create organizer
app.post("/api/organizers", async (req, res) => {
  try {
    const organizer = await Organizer.create(req.body);
    res.status(201).json(organizer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 14. PUT update organizer
app.put("/api/organizers/:id", async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!organizer) return res.status(404).json({ message: "Organizer not found" });
    res.json(organizer);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// ===== REPORTS =====

// 15. Event stats
app.get("/api/reports/event-stats", async (req, res) => {
  const stats = {
    totalEvents: await Event.countDocuments(),
    totalAttendees: await Attendee.countDocuments()
  };
  res.json(stats);
});

// ===== MongoDB Connection & Start Server =====
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log('Server running at http://localhost:${3000}'));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

startServer();