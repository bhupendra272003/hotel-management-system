const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "receptionist", "waiter"],
    default: "receptionist"
  },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  salary: { type: Number, default: 0 },
  profilePicture: { type: String, default: "" },
  joinDate: { type: Date, default: Date.now },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);