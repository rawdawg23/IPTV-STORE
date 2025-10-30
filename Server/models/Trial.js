const mongoose = require("mongoose");

const trialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "converted"],
      default: "pending",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    source: {
      type: String,
      enum: ["website", "referral", "social", "direct"],
      default: "website",
    },
    referralCode: {
      type: String,
    },
    notes: {
      type: String,
    },
    conversionDate: {
      type: Date,
    },
    convertedToPlan: {
      type: String,
      enum: ["basic", "standard", "premium"],
    },
    deviceInfo: {
      type: String,
    },
    location: {
      country: String,
      city: String,
      timezone: String,
    },
  },
  { timestamps: true }
);

// Virtual for checking if trial is active
trialSchema.virtual("isActive").get(function () {
  const now = new Date();
  return this.status === "active" && now <= this.endDate;
});

// Virtual for days remaining
trialSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const diffTime = this.endDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to activate trial
trialSchema.methods.activate = function () {
  this.status = "active";
  this.startDate = new Date();
  this.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return this.save();
};

// Method to convert trial to subscription
trialSchema.methods.convert = function (plan) {
  this.status = "converted";
  this.conversionDate = new Date();
  this.convertedToPlan = plan;
  return this.save();
};

// Method to expire trial
trialSchema.methods.expire = function () {
  this.status = "expired";
  return this.save();
};

// Indexes
trialSchema.index({ email: 1 });
trialSchema.index({ status: 1 });
trialSchema.index({ endDate: 1 });
trialSchema.index({ startDate: 1 });

const Trial = mongoose.model("Trial", trialSchema);

module.exports = Trial;
