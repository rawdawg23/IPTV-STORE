require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan"); // Optional: logs HTTP requests

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// Middleware
// ----------------------
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev")); // Optional: HTTP request logging

// ----------------------
// MongoDB Connection
// ----------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};
connectDB();

// ----------------------
// Basic Test Route
// ----------------------
app.get("/", (req, res) => {
  res.send("Hello from the MERN backend!");
});

// ----------------------
// Routes
// ----------------------
const channelsRouter = require("./routes/channels");
const contactsRouter = require("./routes/contacts");
const authRouter = require("./routes/auth");
const trialsRouter = require("./routes/trials");
const subscriptionsRouter = require("./routes/subscriptions");
const pricingRouter = require("./routes/pricing");

app.use("/api/channels", channelsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/api/trials", trialsRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/pricing", pricingRouter);

// ----------------------
// Global Error Handling (Optional)
// ----------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
