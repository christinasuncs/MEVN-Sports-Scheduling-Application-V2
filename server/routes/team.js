const express = require('express');
const router = express.Router();
const Team = require("../models/Team.js");

router.get("/", async (req, res) => {
    try {
        const teams = await Team.find({});
        res.json(teams)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// get single team
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const team = await Team.findById(id);
        res.json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        const updatedteam = await Team.findByIdAndUpdate(id, updates, {new: true});
        if (!updatedteam) {
            return res.status(404).json({message: "Team not found"});
        }
        res.json(updatedteam);
    } catch (err) {
        res.status(500).json({err: err.message});
    }
})

router.post("/", async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.json(team);
    } catch (err) {
        res.status(500).json
    }
})

module.exports = router;