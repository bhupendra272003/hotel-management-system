const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const auth = require("./routes/auth");
const booking = require("./routes/booking");
const food = require("./routes/food");
const table = require("./routes/table");
const billing = require("./routes/billing");
const customer = require("./routes/customer");
const task = require("./routes/task");

const app = express();

// CORS configuration - COMPLETE & ERROR-FREE
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5500',
  'https://hotel-management-system.vercel.app',
  'https://hotelmna.onrender.com',
  'https://hotel-management-system-pi-flame.vercel.app'
];

// Add FRONTEND_URL from env if it exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Remove any duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log('✅ CORS Allowed Origins:', uniqueOrigins);

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (uniqueOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.log(`❌ CORS Blocked: ${origin}`);
    
    const msg = 'CORS policy does not allow access from this origin.';
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hotel";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
  createDefaultUsers();
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB Error:", err.message);
});

async function createDefaultUsers() {
  try {
    const User = require("./models/User");
    
    const defaultUsers = [
      {
        name: "Admin User",
        email: "admin@hotel.com",
        password: "admin123",
        role: "admin",
        phone: "9999999999",
        salary: 50000,
        isActive: true
      },
      {
        name: "John Receptionist",
        email: "reception@hotel.com",
        password: "recep123",
        role: "receptionist",
        phone: "9876543210",
        salary: 25000,
        isActive: true
      },
      {
        name: "Sarah Waiter",
        email: "waiter@hotel.com",
        password: "waiter123",
        role: "waiter",
        phone: "9876543211",
        salary: 20000,
        isActive: true
      }
    ];
    
    for (const user of defaultUsers) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        await User.create(user);
        console.log(`✅ Created ${user.role}: ${user.email} / ${user.password}`);
      }
    }
    console.log("✅ Default users ready!");
  } catch (error) {
    console.log("⚠️ Users already exist or database not ready");
  }
}

// Routes
app.use("/api/auth", auth);
app.use("/api/booking", booking);
app.use("/api/food", food);
app.use("/api/table", table);
app.use("/api/billing", billing);
app.use("/api/customer", customer);
app.use("/api/tasks", task);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!", status: "ok" });
});

// CORS test route - helps debug
app.get("/api/cors-test", (req, res) => {
  res.json({ 
    message: "CORS is working!",
    yourOrigin: req.headers.origin || "No origin",
    allowedOrigins: uniqueOrigins
  });
});

// Keep-alive ping to prevent spin-down (Render free tier)
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes
const BACKEND_URL = process.env.BACKEND_URL || 'https://hotelmna.onrender.com';

// Only run keep-alive in production
if (process.env.NODE_ENV === 'production') {
  setInterval(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 10000 });
      if (response.status === 200) {
        console.log(`✅ Keep-alive ping sent at ${new Date().toLocaleTimeString()}`);
      }
    } catch (error) {
      console.log(`⚠️ Keep-alive ping failed: ${error.message}`);
    }
  }, KEEP_ALIVE_INTERVAL);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Test API: http://localhost:${PORT}/api/test`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 CORS Test: http://localhost:${PORT}/api/cors-test`);
  console.log(`📋 Allowed Origins:`, uniqueOrigins);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🔄 Keep-alive ping will run every ${KEEP_ALIVE_INTERVAL / 60000} minutes`);
  }
});