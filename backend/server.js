const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./routes/auth");
const booking = require("./routes/booking");
const food = require("./routes/food");
const table = require("./routes/table");
const billing = require("./routes/billing");
const customer = require("./routes/customer");
const task = require("./routes/task");

const app = express();

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/hotel");

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
        console.log(`✅ Created ${user.role}: ${user.email}`);
      }
    }
  } catch (error) {
    console.log("Database ready");
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

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!", status: "ok" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Test API: http://localhost:${PORT}/api/test`);
});