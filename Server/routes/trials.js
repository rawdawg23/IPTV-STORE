const express = require("express");
const router = express.Router();
const Trial = require("../models/Trial");

// POST - Register for free trial
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, plan, source, referralCode, deviceInfo } =
      req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    // Check if email already has an active trial
    const existingTrial = await Trial.findOne({
      email,
      status: { $in: ["pending", "active"] },
    });

    if (existingTrial) {
      return res.status(400).json({
        error: "You already have an active trial with this email",
      });
    }

    // Create trial data
    const trialData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      plan: plan || "basic",
      source: source || "website",
      referralCode: referralCode || "",
      deviceInfo: deviceInfo || "",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    const trial = new Trial(trialData);
    await trial.save();

    res.status(201).json({
      success: true,
      message: "Free trial registered successfully",
      trial: {
        id: trial._id,
        name: trial.name,
        email: trial.email,
        plan: trial.plan,
        status: trial.status,
        endDate: trial.endDate,
        daysRemaining: trial.daysRemaining,
      },
    });
  } catch (error) {
    console.error("Trial registration error:", error);
    res.status(500).json({ error: "Failed to register for trial" });
  }
});

// GET - Get trial status by email
router.get("/status/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const trial = await Trial.findOne({ email }).sort({ createdAt: -1 });

    if (!trial) {
      return res.status(404).json({ error: "No trial found for this email" });
    }

    res.json({
      success: true,
      trial: {
        id: trial._id,
        name: trial.name,
        email: trial.email,
        plan: trial.plan,
        status: trial.status,
        startDate: trial.startDate,
        endDate: trial.endDate,
        daysRemaining: trial.daysRemaining,
        isActive: trial.isActive,
      },
    });
  } catch (error) {
    console.error("Trial status error:", error);
    res.status(500).json({ error: "Failed to get trial status" });
  }
});

// PUT - Activate trial
router.put("/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;

    const trial = await Trial.findById(id);
    if (!trial) {
      return res.status(404).json({ error: "Trial not found" });
    }

    if (trial.status !== "pending") {
      return res.status(400).json({ error: "Trial cannot be activated" });
    }

    await trial.activate();

    res.json({
      success: true,
      message: "Trial activated successfully",
      trial: {
        id: trial._id,
        status: trial.status,
        startDate: trial.startDate,
        endDate: trial.endDate,
        daysRemaining: trial.daysRemaining,
      },
    });
  } catch (error) {
    console.error("Trial activation error:", error);
    res.status(500).json({ error: "Failed to activate trial" });
  }
});

// PUT - Convert trial to subscription
router.put("/:id/convert", async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    if (!plan || !["basic", "standard", "premium"].includes(plan)) {
      return res.status(400).json({ error: "Valid plan is required" });
    }

    const trial = await Trial.findById(id);
    if (!trial) {
      return res.status(404).json({ error: "Trial not found" });
    }

    await trial.convert(plan);

    res.json({
      success: true,
      message: "Trial converted successfully",
      trial: {
        id: trial._id,
        status: trial.status,
        convertedToPlan: trial.convertedToPlan,
        conversionDate: trial.conversionDate,
      },
    });
  } catch (error) {
    console.error("Trial conversion error:", error);
    res.status(500).json({ error: "Failed to convert trial" });
  }
});

// GET - Get all trials (admin)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, plan } = req.query;

    const query = {};
    if (status) query.status = status;
    if (plan) query.plan = plan;

    const trials = await Trial.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Trial.countDocuments(query);

    res.json({
      success: true,
      trials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Fetch trials error:", error);
    res.status(500).json({ error: "Failed to fetch trials" });
  }
});

// GET - Get trial statistics (admin)
router.get("/stats", async (req, res) => {
  try {
    const totalTrials = await Trial.countDocuments();
    const activeTrials = await Trial.countDocuments({ status: "active" });
    const convertedTrials = await Trial.countDocuments({ status: "converted" });
    const expiredTrials = await Trial.countDocuments({ status: "expired" });

    // Get conversion rate
    const conversionRate =
      totalTrials > 0 ? ((convertedTrials / totalTrials) * 100).toFixed(2) : 0;

    // Get trials by plan
    const trialsByPlan = await Trial.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get trials by source
    const trialsBySource = await Trial.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        total: totalTrials,
        active: activeTrials,
        converted: convertedTrials,
        expired: expiredTrials,
        conversionRate: parseFloat(conversionRate),
        byPlan: trialsByPlan,
        bySource: trialsBySource,
      },
    });
  } catch (error) {
    console.error("Trial stats error:", error);
    res.status(500).json({ error: "Failed to get trial statistics" });
  }
});

// DELETE - Delete trial (admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const trial = await Trial.findByIdAndDelete(id);
    if (!trial) {
      return res.status(404).json({ error: "Trial not found" });
    }

    res.json({
      success: true,
      message: "Trial deleted successfully",
    });
  } catch (error) {
    console.error("Trial delete error:", error);
    res.status(500).json({ error: "Failed to delete trial" });
  }
});

module.exports = router;
