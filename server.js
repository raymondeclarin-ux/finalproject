// Event Management API
// Final Project Phase 1

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ==================== HOME ROUTE ====================
app.get("/", (req, res) => {
  res.send("🎉 Event Management API is running! Use /api/events, /api/attendees, /api/organizers");
});

// ==================== SAMPLE DATA ====================
let events = [
  { id: 1, name: "Tech Conference 2025", date: "2025-12-01", venue: "NEU Auditorium" },
  { id: 2, name: "Music Festival", date: "2025-11-10", venue: "City Park" },
];

let attendees = [
  { id: 1, name: "Alice", eventId: 1 },
  { id: 2, name: "Bob", eventId: 2 },
];

let organizers = [
  { id: 1, name: "John Doe", contact: "john@email.com" },
];

// ==================== EVENT ROUTES ====================

// GET all events
app.get("/api/events", (req, res) => {
  res.json(events);
});

// GET specific event
app.get("/api/events/:id", (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  event ? res.json(event) : res.status(404).json({ message: "Event not found" });
});

// POST create new event
app.post("/api/events", (req, res) => {
  const newEvent = { id: events.length + 1, ...req.body };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// PUT update event (full)
app.put("/api/events/:id", (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ message: "Event not found" });

  event.name = req.body.name;
  event.date = req.body.date;
  event.venue = req.body.venue;

  res.json(event);
});

// PATCH update event (partial)
app.patch("/api/events/:id", (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ message: "Event not found" });

  Object.assign(event, req.body);
  res.json(event);
});

// DELETE event
app.delete("/api/events/:id", (req, res) => {
  events = events.filter(e => e.id !== parseInt(req.params.id));
  res.json({ message: "Event deleted successfully" });
});

// ==================== ATTENDEE ROUTES ====================

// GET all attendees
app.get("/api/attendees", (req, res) => {
  res.json(attendees);
});

// POST add new attendee
app.post("/api/attendees", (req, res) => {
  const newAttendee = { id: attendees.length + 1, ...req.body };
  attendees.push(newAttendee);
  res.status(201).json(newAttendee);
});

// DELETE attendee
app.delete("/api/attendees/:id", (req, res) => {
  attendees = attendees.filter(a => a.id !== parseInt(req.params.id));
  res.json({ message: "Attendee removed" });
});

// ==================== ORGANIZER ROUTES ====================

// GET all organizers
app.get("/api/organizers", (req, res) => {
  res.json(organizers);
});

// POST new organizer
app.post("/api/organizers", (req, res) => {
  const newOrg = { id: organizers.length + 1, ...req.body };
  organizers.push(newOrg);
  res.status(201).json(newOrg);
});

// PUT update organizer
app.put("/api/organizers/:id", (req, res) => {
  const org = organizers.find(o => o.id === parseInt(req.params.id));
  if (!org) return res.status(404).json({ message: "Organizer not found" });

  org.name = req.body.name;
  org.contact = req.body.contact;

  res.json(org);
});

// ==================== REPORTS ====================
app.get("/api/reports/event-stats", (req, res) => {
  res.json({
    totalEvents: events.length,
    totalAttendees: attendees.length
  });
});

// ==================== SERVER START ====================
app.listen(port, () => {
  console.log(`✅ Event Management API running at http://localhost:${3000}`);
});
