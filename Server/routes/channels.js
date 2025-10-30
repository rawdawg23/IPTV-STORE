const express = require("express"); // Import express
const router = express.Router(); // Create a router instance
const Channel = require("../models/Channel"); // Import your Channel model
const mongoose = require("mongoose");

// POST - Create new channel
router.post("/", async (req, res) => {
  try {
    const channel = new Channel(req.body);
    await channel.save();
    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET - Fetch all channels
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find();
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH - Update channel
router.patch("/:id", async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Remove channel
router.delete("/:id", async (req, res) => {
  try {
    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: "Channel deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; // Export the router
