const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Pricing = require("../models/Pricing");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// GET - Get user's subscription
router.get("/", authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({ error: "No subscription found" });
    }

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

// POST - Create new subscription
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { plan, billingCycle, paymentMethod } = req.body;

    // Validation
    if (!plan || !["basic", "standard", "premium"].includes(plan)) {
      return res.status(400).json({ error: "Valid plan is required" });
    }

    if (!billingCycle || !["monthly", "yearly"].includes(billingCycle)) {
      return res.status(400).json({ error: "Valid billing cycle is required" });
    }

    // Get plan pricing from database
    const pricingPlan = await Pricing.findOne({ plan, isActive: true });

    if (!pricingPlan) {
      return res
        .status(400)
        .json({ error: "Pricing plan not found or inactive" });
    }

    const amount =
      billingCycle === "monthly"
        ? pricingPlan.monthlyPrice
        : pricingPlan.yearlyPrice;
    const endDate =
      billingCycle === "monthly"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    // Get plan features from pricing plan
    const features = pricingPlan.features;

    // Check if user already has a subscription
    const existingSubscription = await Subscription.findOne({
      userId: req.user._id,
    });

    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.plan = plan;
      existingSubscription.billingCycle = billingCycle;
      existingSubscription.amount = amount;
      existingSubscription.status = "active";
      existingSubscription.endDate = endDate;
      existingSubscription.paymentMethod =
        paymentMethod || existingSubscription.paymentMethod;
      existingSubscription.features = features;

      await existingSubscription.save();

      // Update user plan
      await User.findByIdAndUpdate(req.user._id, { plan });

      res.json({
        success: true,
        message: "Subscription updated successfully",
        subscription: existingSubscription,
      });
    } else {
      // Create new subscription
      const subscription = new Subscription({
        userId: req.user._id,
        plan,
        billingCycle,
        amount,
        status: "active",
        endDate,
        paymentMethod: paymentMethod || "",
        features: features,
      });

      await subscription.save();

      // Update user plan
      await User.findByIdAndUpdate(req.user._id, { plan });

      res.status(201).json({
        success: true,
        message: "Subscription created successfully",
        subscription,
      });
    }
  } catch (error) {
    console.error("Subscription creation error:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// PUT - Upgrade subscription
router.put("/upgrade", authenticateToken, async (req, res) => {
  try {
    const { newPlan, billingCycle } = req.body;

    if (!newPlan || !["basic", "standard", "premium"].includes(newPlan)) {
      return res.status(400).json({ error: "Valid plan is required" });
    }

    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({ error: "No subscription found" });
    }

    // Check if upgrade is valid
    if (!subscription.canUpgrade(newPlan)) {
      return res.status(400).json({ error: "Invalid upgrade path" });
    }

    // Get new plan pricing from database
    const newPricingPlan = await Pricing.findOne({
      plan: newPlan,
      isActive: true,
    });

    if (!newPricingPlan) {
      return res
        .status(400)
        .json({ error: "New pricing plan not found or inactive" });
    }

    const newBillingCycle = billingCycle || subscription.billingCycle;
    const newAmount =
      newBillingCycle === "monthly"
        ? newPricingPlan.monthlyPrice
        : newPricingPlan.yearlyPrice;

    // Update subscription
    subscription.plan = newPlan;
    subscription.billingCycle = newBillingCycle;
    subscription.amount = newAmount;
    subscription.features = newPricingPlan.features;

    await subscription.save();

    // Update user plan
    await User.findByIdAndUpdate(req.user._id, { plan: newPlan });

    res.json({
      success: true,
      message: "Subscription upgraded successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    res.status(500).json({ error: "Failed to upgrade subscription" });
  }
});

// PUT - Cancel subscription
router.put("/cancel", authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({ error: "No subscription found" });
    }

    subscription.status = "cancelled";
    subscription.autoRenew = false;
    await subscription.save();

    res.json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// PUT - Reactivate subscription
router.put("/reactivate", authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({ error: "No subscription found" });
    }

    subscription.status = "active";
    subscription.autoRenew = true;
    await subscription.save();

    res.json({
      success: true,
      message: "Subscription reactivated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription reactivation error:", error);
    res.status(500).json({ error: "Failed to reactivate subscription" });
  }
});

// GET - Get subscription history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({ error: "No subscription found" });
    }

    res.json({
      success: true,
      paymentHistory: subscription.paymentHistory,
    });
  } catch (error) {
    console.error("Subscription history error:", error);
    res.status(500).json({ error: "Failed to fetch subscription history" });
  }
});

// GET - Get all subscriptions (admin)
router.get("/admin", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, plan } = req.query;

    const query = {};
    if (status) query.status = status;
    if (plan) query.plan = plan;

    const subscriptions = await Subscription.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subscription.countDocuments(query);

    res.json({
      success: true,
      subscriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Fetch subscriptions error:", error);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

// GET - Get subscription statistics (admin)
router.get("/admin/stats", async (req, res) => {
  try {
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({
      status: "active",
    });
    const cancelledSubscriptions = await Subscription.countDocuments({
      status: "cancelled",
    });
    const trialSubscriptions = await Subscription.countDocuments({
      status: "trial",
    });

    // Get subscriptions by plan
    const subscriptionsByPlan = await Subscription.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    // Get subscriptions by billing cycle
    const subscriptionsByBilling = await Subscription.aggregate([
      {
        $group: {
          _id: "$billingCycle",
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate total revenue
    const totalRevenue = await Subscription.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        cancelled: cancelledSubscriptions,
        trial: trialSubscriptions,
        totalRevenue: totalRevenue[0]?.total || 0,
        byPlan: subscriptionsByPlan,
        byBilling: subscriptionsByBilling,
      },
    });
  } catch (error) {
    console.error("Subscription stats error:", error);
    res.status(500).json({ error: "Failed to get subscription statistics" });
  }
});

module.exports = router;
