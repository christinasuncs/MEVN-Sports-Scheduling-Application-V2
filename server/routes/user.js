const express = require('express');
const router = express.Router();
const User = require("../models/User.js");

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// update user
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updates, {new: true});
        if (!updatedUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({err: err.message});
    }
})

// delete event
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "User deleted successfully."});
    } catch (err) {
        res.status(500).json({err: err.message})
    }
})

module.exports = router;