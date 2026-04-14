const mongoose = require('mongoose');
require('dotenv').config();

// Replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://hotel_user:StrongPassword123!@cluster0.3s4isxq.mongodb.net/?appName=Cluster0';

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();