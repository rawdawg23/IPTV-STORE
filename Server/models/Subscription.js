const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "trial"],
      default: "trial",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    trialEndDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
    },
    paymentMethod: {
      type: String,
      default: "",
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentHistory: [
      {
        amount: Number,
        currency: String,
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed", "refunded"],
          default: "pending",
        },
        transactionId: String,
      },
    ],
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
      },
      vodLibrary: {
        type: Boolean,
        default: false,
      },
      premiumSports: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// Virtual for checking if subscription is active
subscriptionSchema.virtual("isActive").get(function () {
  const now = new Date();
  return this.status === "active" && now <= this.endDate;
});

// Virtual for checking if in trial period
subscriptionSchema.virtual("isTrial").get(function () {
  const now = new Date();
  return this.status === "trial" && now <= this.trialEndDate;
});

// Virtual for days remaining
subscriptionSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const endDate = this.status === "trial" ? this.trialEndDate : this.endDate;
  const diffTime = endDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check if subscription can be upgraded
subscriptionSchema.methods.canUpgrade = function (newPlan) {
  const planHierarchy = { basic: 1, standard: 2, premium: 3 };
  return planHierarchy[newPlan] > planHierarchy[this.plan];
};

// Method to get plan features
subscriptionSchema.methods.getPlanFeatures = function () {
  const planFeatures = {
    basic: {
      channels: 100,
      quality: "SD",
      connections: 1,
      vodLibrary: false,
      premiumSports: false,
    },
    standard: {
      channels: 200,
      quality: "HD",
      connections: 2,
      vodLibrary: true,
      premiumSports: false,
    },
    premium: {
      channels: 300,
      quality: "4K",
      connections: 4,
      vodLibrary: true,
      premiumSports: true,
    },
  };

  return planFeatures[this.plan] || planFeatures.basic;
};

// Indexes
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
