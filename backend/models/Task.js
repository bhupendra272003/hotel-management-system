const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  taskType: {
    type: String,
    enum: ["room_cleaning", "order_serve", "table_setup", "linen_change", "minibar_refill", "guest_request"],
    default: "room_cleaning"
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomNo: String,
  tableId: String,
  orderId: String,
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  notes: String
});

module.exports = mongoose.model("Task", taskSchema);