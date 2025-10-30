const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    monthlyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    yearlyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      channels: {
        type: Number,
        required: true,
      },
      quality: {
        type: String,
        enum: ["SD", "HD", "4K"],
        required: true,
      },
      connections: {
        type: Number,
        required: true,
        min: 1,
      },
      vodLibrary: {
        type: Boolean,
        default: false,
      },
      premiumSports: {
        type: Boolean,
        default: false,
      },
      support: {
        type: String,
        enum: ["email", "chat", "phone"],
        default: "email",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    trialDays: {
      type: Number,
      default: 7,
      min: 0,
    },
  },
  { timestamps: true }
);

// Virtual for yearly savings percentage
pricingSchema.virtual("yearlySavings").get(function () {
  const monthlyTotal = this.monthlyPrice * 12;
  const savings = monthlyTotal - this.yearlyPrice;
  return Math.round((savings / monthlyTotal) * 100);
});

// Method to get formatted price
pricingSchema.methods.getFormattedPrice = function (billingCycle) {
  const price =
    billingCycle === "monthly" ? this.monthlyPrice : this.yearlyPrice;
  return {
    amount: price,
    formatted: `$${price}`,
    billingCycle,
  };
};

// Method to get all features as array
pricingSchema.methods.getFeaturesList = function () {
  const features = [];

  features.push(`Access to ${this.features.channels}+ channels`);
  features.push(`${this.features.quality} quality`);
  features.push(
    `${this.features.connections} connection${
      this.features.connections > 1 ? "s" : ""
    }`
  );

  if (this.features.vodLibrary) {
    features.push("VOD Library");
  }

  if (this.features.premiumSports) {
    features.push("Premium Sports Channels");
  }

  features.push("24/7 Support");

  return features;
};

// Indexes
pricingSchema.index({ plan: 1 });
pricingSchema.index({ isActive: 1 });
pricingSchema.index({ sortOrder: 1 });

const Pricing = mongoose.model("Pricing", pricingSchema);

module.exports = Pricing;
