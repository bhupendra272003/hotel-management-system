const mongoose = require("mongoose");

const tableOrderSchema = new mongoose.Schema({
  itemName: String,
  quantity: Number,
  price: Number,
  total: Number,
  orderedAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
  notes: String
});

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  persons: { type: Number, required: true },
  tableNumber: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  specialRequests: String,
  orders: [tableOrderSchema],
  totalOrderAmount: { type: Number, default: 0 },
  advanceAmount: { type: Number, default: 500 },
  totalAmount: { type: Number, default: 0 },
  bookingStatus: { 
    type: String, 
    enum: ["available", "booked", "occupied"], 
    default: "available" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["unpaid", "partial", "paid", "refunded"], 
    default: "unpaid" 
  },
  paymentMethod: String,
  transactionId: String,
  paymentDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Table", tableSchema);