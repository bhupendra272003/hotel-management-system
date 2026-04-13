const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  roomNo: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  items: Array,
  total: Number,
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid"
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "room_charge"],
    default: "cash"
  },
  transactionId: String,
  paymentDate: Date,
  orderType: {
    type: String,
    enum: ["dine_in", "room_delivery"],
    default: "room_delivery"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Food", foodSchema);