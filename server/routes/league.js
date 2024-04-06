const express = require('express');
const router = express.Router();
const League = require("../models/League.js");

// get all league
router.get("/", async (req, res) => {
    try {
        const leagues = await League.find({});
        res.json(leagues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// create a league
router.post("/", async (req, res) => {
    try {
        const league = new League(req.body);
        await league.save();
        res.json(league);
    } catch (err) {
        res.status(500).json
    }
});

// update league
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        const updatedLeague = await League.findByIdAndUpdate(id, updates, {new: true});
        if (!updatedLeague) {
            return res.status(404).json({message: "Event not found"});
        }
        res.json(updatedLeague);
    } catch (err) {
        res.status(500).json({err: err.message});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleteLeague = await League.findByIdAndDelete(id);
        if (!deleteLeague) {
            return res.status(404).json({message: "League not found"});
        }
        res.json({message: "League deleted successfully."});
    } catch (err) {
        res.status(500).json({err: err.message})
    }
})

module.exports = router;