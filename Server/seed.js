require("dotenv").config();
const mongoose = require("mongoose");
const Channel = require("./models/Channel");

const channels = [
  {
    name: "Bien sport",
    url: "https://www.beinsports.com/ar-mena",
    categories: ["sports"],
    language: "English",
    logo: "https://i.pinimg.com/1200x/20/f8/53/20f853787e15c584b40cb92aee225029.jpg",
    viewers: 1200,
    premium: false,
    currentlyPlaying: "Live Football",
  },
  {
    name: "france 24",
    url: "https://www.france24.com/en/live",
    categories: ["news"],
    language: "English",
    logo: "https://i.pinimg.com/736x/c9/15/68/c91568a9df3282a73c3defddce9afdc5.jpg",
    viewers: 14000,
    premium: true,
    currentlyPlaying: "Live News",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => Channel.insertMany(channels))
  .then(() => console.log("Database seeded!"))
  .catch(console.error)
  .finally(() => mongoose.disconnect());
