const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
    firebaseUid: {
      type: String,
      sparse: true,
      unique: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    planExpiry: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    subscriptionActive: {
      type: Boolean,
      default: true,
    },
    paymentMethod: {
      type: String,
      default: "",
    },
    watchHistory: [
      {
        channelId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Channel",
        },
        lastWatched: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    devices: [
      {
        name: String,
        deviceId: String,
        lastActive: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
      },
    ],
    notifications: [
      {
        message: String,
        date: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
        type: {
          type: String,
          enum: ["subscription", "channel", "system"],
          default: "system",
        },
      },
    ],
    settings: {
      language: {
        type: String,
        default: "en",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "dark",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firebaseUid: 1 }, { sparse: true });
userSchema.index({ plan: 1 });
userSchema.index({ subscriptionActive: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
