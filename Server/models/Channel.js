const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    categories: { // Changed from 'category' to 'categories' and made an array
      type: [String],
      default: [],
    },
    language: String,
    logo: String,
    viewers: {
      type: Number,
      default: 0,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    currentlyPlaying: {
      type: String,
      default: "No information available",
    },
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
