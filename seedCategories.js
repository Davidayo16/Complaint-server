const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");

dotenv.config();

// Nigeria / PHCN-focused default categories
const categories = [
  {
    name: "No Power Supply / Outage",
    description: "Complete loss of electricity supply in your area or premises",
  },
  {
    name: "Frequent Power Interruption",
    description: "Power goes off and on repeatedly (frequent outages)",
  },
  {
    name: "Low Voltage / Fluctuation",
    description: "Very low voltage or unstable power damaging appliances",
  },
  {
    name: "Overbilling",
    description: "Bills are higher than actual consumption or agreed tariff",
  },
  {
    name: "Estimated Billing",
    description: "Billing based on estimation instead of actual meter reading",
  },
  {
    name: "Prepaid Meter Issues",
    description: "Issues related to prepaid meters, vending, or tokens",
  },
  {
    name: "Wrong Meter Reading",
    description: "Meter is read wrongly leading to incorrect bills",
  },
  {
    name: "Illegal Disconnection",
    description: "Electricity supply disconnected without proper notice or reason",
  },
  {
    name: "New Connection / Meter Request",
    description: "Requesting new connection or meter installation",
  },
  {
    name: "Transformer / Feeder Fault",
    description: "Faulty transformer, feeder pillar, or related equipment",
  },
  {
    name: "Safety / Hazard",
    description: "Exposed wires, fallen poles, or any electricity safety hazard",
  },
  {
    name: "Customer Service / Office",
    description: "Poor handling of complaints at service centers or by staff",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    // console.log("Database:", mongoose.connection.name);
    await Category.deleteMany({});
    console.log("Cleared existing categories");
    await Category.insertMany(categories);
    console.log(
      "Categories seeded successfully:",
      categories.map((c) => c.name)
    );
  } catch (err) {
    console.error("Error seeding categories:", err.message, err.stack);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedCategories();
