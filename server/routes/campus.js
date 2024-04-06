const express = require('express');
const router = express.Router();
const Campus = require("../models/Campus.js");

// get all campuses
router.get("/", async (req, res) => {
    try {
        const campuses = await Campus.find({});
        res.json(campuses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// get single campus
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const campus = await Campus.findById(id);
        res.json(campus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// create a campus
router.post("/", async (req, res) => {
    try {
        const campus = new Campus(req.body);
        await campus.save();
        res.json(campus);
    } catch (err) {
        res.status(500).json
    }
})

module.exports = router;