const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const auth = require("./routes/auth");
const booking = require("./routes/booking");
const food = require("./routes/food");
const table = require("./routes/table");
const billing = require("./routes/billing");
const customer = require("./routes/customer");
const task = require("./routes/task");

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://hotel-management-system.vercel.app',
  'https://hotelmna.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    const msg = 'CORS policy does not allow access from this origin.';
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hotel";

mongoose.connect(MONGODB_URI);

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
    console.log("Database ready - users will be created when needed");
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Test API: http://localhost:${PORT}/api/test`);
});