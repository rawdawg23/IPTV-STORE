const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
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

// POST - Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Create default subscription
    const subscription = new Subscription({
      userId: user._id,
      plan: "basic",
      amount: 0,
      status: "trial",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
      features: {
        channels: 100,
        quality: "SD",
        connections: 1,
        vodLibrary: false,
        premiumSports: false,
      },
    });

    await subscription.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST - Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET - Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "watchHistory.channelId",
        select: "name logo categories",
      })
      .select("-password");

    // Get subscription info
    const subscription = await Subscription.findOne({ userId: user._id });

    res.json({
      success: true,
      user,
      subscription,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT - Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, avatar, settings } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (settings) updates.settings = { ...req.user.settings, ...settings };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// POST - Add device
router.post("/devices", authenticateToken, async (req, res) => {
  try {
    const { name, deviceId } = req.body;

    if (!name || !deviceId) {
      return res.status(400).json({ error: "Device name and ID are required" });
    }

    const user = await User.findById(req.user._id);

    // Check if device already exists
    const existingDevice = user.devices.find((d) => d.deviceId === deviceId);
    if (existingDevice) {
      existingDevice.lastActive = new Date();
      existingDevice.isActive = true;
    } else {
      user.devices.push({
        name,
        deviceId,
        lastActive: new Date(),
        isActive: true,
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Device added successfully",
      devices: user.devices,
    });
  } catch (error) {
    console.error("Device add error:", error);
    res.status(500).json({ error: "Failed to add device" });
  }
});

// DELETE - Remove device
router.delete("/devices/:deviceId", authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;

    const user = await User.findById(req.user._id);
    user.devices = user.devices.filter((d) => d.deviceId !== deviceId);
    await user.save();

    res.json({
      success: true,
      message: "Device removed successfully",
      devices: user.devices,
    });
  } catch (error) {
    console.error("Device remove error:", error);
    res.status(500).json({ error: "Failed to remove device" });
  }
});

// POST - Mark notification as read
router.post(
  "/notifications/:notificationId/read",
  authenticateToken,
  async (req, res) => {
    try {
      const { notificationId } = req.params;

      const user = await User.findById(req.user._id);
      const notification = user.notifications.id(notificationId);

      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      notification.read = true;
      await user.save();

      res.json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error) {
      console.error("Notification update error:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  }
);

// POST - Mark all notifications as read
router.post("/notifications/read-all", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.notifications.forEach((notification) => {
      notification.read = true;
    });
    await user.save();

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Notifications update error:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

module.exports = router;
