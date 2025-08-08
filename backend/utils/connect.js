// backend/utils/connect.js

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    isConnected = db.connections[0].readyState;
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
