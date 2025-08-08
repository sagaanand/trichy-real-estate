const mongoose = require('mongoose');
const Listing = require('../models/Listing'); // adjust path if needed
require('dotenv').config({ path: '../.env' });

const listings = [
  {
    title: "Luxury Apartment",
    type: "apartment",
    price: 3800000,
    area: 1000,
    address: "4th Street, Ring Road",
    city: "Trichy",
    areaName: "Panjapur",
    pincode: "620012",
    location: { lat: 10.8005, lng: 78.6902 },
    description: "2BHK flat with gated security and parking.",
    status: "approved",
    images: ["https://source.unsplash.com/400x300/?apartment"],
    user: "admin"
  },
  {
    title: "Residential Plot",
    type: "land",
    price: 1800000,
    area: 2400,
    address: "Plot No 17, Near Temple",
    city: "Trichy",
    areaName: "Ring Road",
    pincode: "620012",
    location: { lat: 10.8032, lng: 78.6833 },
    description: "DTCP approved land ideal for investment.",
    status: "approved",
    images: ["https://source.unsplash.com/400x300/?land"],
    user: "admin"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Listing.deleteMany(); // optional: clears old
    await Listing.insertMany(listings);
    console.log("✅ Sample listings added.");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
