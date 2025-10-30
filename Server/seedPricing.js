const mongoose = require("mongoose");
const Pricing = require("./models/Pricing");
require("dotenv").config();

const pricingPlans = [
  {
    plan: "basic",
    name: "Basic",
    description: "Perfect for casual viewers",
    monthlyPrice: 15,
    yearlyPrice: 144, // 20% discount
    features: {
      channels: 100,
      quality: "SD",
      connections: 1,
      vodLibrary: false,
      premiumSports: false,
      support: "email",
    },
    isActive: true,
    isPopular: false,
    sortOrder: 1,
    discount: 20,
    trialDays: 7,
  },
  {
    plan: "standard",
    name: "Standard",
    description: "Great for families and sports fans",
    monthlyPrice: 25,
    yearlyPrice: 240, // 20% discount
    features: {
      channels: 200,
      quality: "HD",
      connections: 2,
      vodLibrary: true,
      premiumSports: false,
      support: "chat",
    },
    isActive: true,
    isPopular: true,
    sortOrder: 2,
    discount: 20,
    trialDays: 7,
  },
  {
    plan: "premium",
    name: "Premium",
    description: "Ultimate entertainment experience",
    monthlyPrice: 40,
    yearlyPrice: 384, // 20% discount
    features: {
      channels: 300,
      quality: "4K",
      connections: 4,
      vodLibrary: true,
      premiumSports: true,
      support: "phone",
    },
    isActive: true,
    isPopular: false,
    sortOrder: 3,
    discount: 20,
    trialDays: 7,
  },
];

async function seedPricing() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing pricing plans
    await Pricing.deleteMany({});
    console.log("Cleared existing pricing plans");

    // Insert new pricing plans
    const createdPlans = await Pricing.insertMany(pricingPlans);
    console.log(`Created ${createdPlans.length} pricing plans:`);

    createdPlans.forEach((plan) => {
      console.log(
        `- ${plan.name}: $${plan.monthlyPrice}/month, $${plan.yearlyPrice}/year`
      );
    });

    console.log("Pricing seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding pricing:", error);
    process.exit(1);
  }
}

seedPricing();
