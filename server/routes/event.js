const express = require('express');
const router = express.Router();
const Event = require("../models/Event.js");
const { isAuthenticated, hasPermission } = require('../index.js');

// get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// create event
router.post("/", async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json
    }
})

// update event
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(id, updates, {new: true});
        if (!updatedEvent) {
            return res.status(404).json({message: "Event not found"});
        }
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({err: err.message});
    }
})

// delete event
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleteEvent = await Event.findByIdAndDelete(id);
        if (!deleteEvent) {
            return res.status(404).json({message: "Event not found"});
        }
        res.json({message: "Event deleted successfully."});
    } catch (err) {
        res.status(500).json({err: err.message})
    }
})

module.exports = router;