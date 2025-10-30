const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST - Create new contact submission
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email, and message are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
      });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    };

    const contact = new Contact(contactData);
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({
      error: "Failed to submit contact form. Please try again.",
    });
  }
});

// GET - Fetch all contacts (admin only)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// GET - Fetch single contact by ID
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact" });
  }
});

// PATCH - Update contact status
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (status && !["pending", "read", "replied"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be pending, read, or replied",
      });
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// DELETE - Remove contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

module.exports = router;
