const express = require("express");
const router = express.Router();
const Pricing = require("../models/Pricing");

// GET - Get all pricing plans (public)
router.get("/", async (req, res) => {
  try {
    const pricingPlans = await Pricing.find({}).sort({
      sortOrder: 1,
      plan: 1,
    });

    res.json({
      success: true,
      plans: pricingPlans,
    });
  } catch (error) {
    console.error("Fetch pricing error:", error);
    res.status(500).json({ error: "Failed to fetch pricing plans" });
  }
});

// GET - Get single pricing plan
router.get("/:plan", async (req, res) => {
  try {
    const { plan } = req.params;

    const pricingPlan = await Pricing.findOne({ plan, isActive: true });

    if (!pricingPlan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    res.json({
      success: true,
      plan: pricingPlan,
    });
  } catch (error) {
    console.error("Fetch pricing plan error:", error);
    res.status(500).json({ error: "Failed to fetch pricing plan" });
  }
});

// POST - Create new pricing plan (admin)
router.post("/", async (req, res) => {
  try {
    const {
      plan,
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      features,
      isPopular,
      sortOrder,
      discount,
      trialDays,
    } = req.body;

    // Validation
    if (!plan || !name || !description || !monthlyPrice || !yearlyPrice) {
      return res.status(400).json({
        error: "Plan, name, description, and prices are required",
      });
    }

    // Check if plan already exists
    const existingPlan = await Pricing.findOne({ plan });
    if (existingPlan) {
      return res.status(400).json({ error: "Plan already exists" });
    }

    const pricingPlan = new Pricing({
      plan,
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      features,
      isPopular: isPopular || false,
      sortOrder: sortOrder || 0,
      discount: discount || 0,
      trialDays: trialDays || 7,
    });

    await pricingPlan.save();

    res.status(201).json({
      success: true,
      message: "Pricing plan created successfully",
      plan: pricingPlan,
    });
  } catch (error) {
    console.error("Create pricing error:", error);
    res.status(500).json({ error: "Failed to create pricing plan" });
  }
});

// PUT - Update pricing plan (admin)
router.put("/:plan", async (req, res) => {
  try {
    const { plan } = req.params;
    const updates = req.body;

    // Remove plan from updates to prevent changing the plan name
    delete updates.plan;

    const pricingPlan = await Pricing.findOneAndUpdate({ plan }, updates, {
      new: true,
      runValidators: true,
    });

    if (!pricingPlan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    res.json({
      success: true,
      message: "Pricing plan updated successfully",
      plan: pricingPlan,
    });
  } catch (error) {
    console.error("Update pricing error:", error);
    res.status(500).json({ error: "Failed to update pricing plan" });
  }
});

// PATCH - Update specific pricing fields (admin)
router.patch("/:plan", async (req, res) => {
  try {
    const { plan } = req.params;
    const updates = req.body;

    // Remove plan from updates
    delete updates.plan;

    const pricingPlan = await Pricing.findOneAndUpdate(
      { plan },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!pricingPlan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    res.json({
      success: true,
      message: "Pricing plan updated successfully",
      plan: pricingPlan,
    });
  } catch (error) {
    console.error("Update pricing error:", error);
    res.status(500).json({ error: "Failed to update pricing plan" });
  }
});

// DELETE - Delete pricing plan (admin)
router.delete("/:plan", async (req, res) => {
  try {
    const { plan } = req.params;

    const pricingPlan = await Pricing.findOneAndDelete({ plan });

    if (!pricingPlan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    res.json({
      success: true,
      message: "Pricing plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete pricing error:", error);
    res.status(500).json({ error: "Failed to delete pricing plan" });
  }
});

// PUT - Toggle plan active status (admin)
router.put("/:plan/toggle", async (req, res) => {
  try {
    const { plan } = req.params;

    const pricingPlan = await Pricing.findOne({ plan });

    if (!pricingPlan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    pricingPlan.isActive = !pricingPlan.isActive;
    await pricingPlan.save();

    res.json({
      success: true,
      message: `Pricing plan ${
        pricingPlan.isActive ? "activated" : "deactivated"
      } successfully`,
      plan: pricingPlan,
    });
  } catch (error) {
    console.error("Toggle pricing error:", error);
    res.status(500).json({ error: "Failed to toggle pricing plan" });
  }
});

// PUT - Set popular plan (admin)
router.put("/:plan/popular", async (req, res) => {
  try {
    const { plan } = req.params;
    const { isPopular } = req.body;

    // First, remove popular flag from all plans
    await Pricing.updateMany({}, { isPopular: false });

    // Then set the specified plan as popular
    const pricingPlan = await Pricing.findOneAndUpdate(
      { plan },
      { isPopular: isPopular || false },
      { new: true }
    );

    if (!pricingPlan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    res.json({
      success: true,
      message: `Pricing plan ${isPopular ? "set as" : "removed from"} popular`,
      plan: pricingPlan,
    });
  } catch (error) {
    console.error("Set popular pricing error:", error);
    res.status(500).json({ error: "Failed to set popular pricing plan" });
  }
});

// GET - Get pricing statistics (admin)
router.get("/admin/stats", async (req, res) => {
  try {
    const totalPlans = await Pricing.countDocuments();
    const activePlans = await Pricing.countDocuments({ isActive: true });
    const popularPlans = await Pricing.countDocuments({ isPopular: true });

    // Get average prices
    const avgMonthlyPrice = await Pricing.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: "$monthlyPrice" } } },
    ]);

    const avgYearlyPrice = await Pricing.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: "$yearlyPrice" } } },
    ]);

    res.json({
      success: true,
      stats: {
        total: totalPlans,
        active: activePlans,
        popular: popularPlans,
        avgMonthlyPrice: avgMonthlyPrice[0]?.avg || 0,
        avgYearlyPrice: avgYearlyPrice[0]?.avg || 0,
      },
    });
  } catch (error) {
    console.error("Pricing stats error:", error);
    res.status(500).json({ error: "Failed to get pricing statistics" });
  }
});

module.exports = router;
