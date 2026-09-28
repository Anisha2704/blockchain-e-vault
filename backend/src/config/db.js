const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blockchain_evault');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Non-fatal fallback for development if local mongodb server is starting up or unavailable
    console.warn('⚠️ Warning: Database operations will fail if MongoDB server is offline.');
  }
};

module.exports = connectDB;
