const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  roomNo: String,
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  
  // Charges breakdown
  roomCharge: { type: Number, default: 0 },
  foodCharge: { type: Number, default: 0 },
  tableCharge: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  
  // Payment tracking per category
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "partial"],
    default: "unpaid"
  },
  roomPaymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "partial"],
    default: "unpaid"
  },
  foodPaymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "partial"],
    default: "unpaid"
  },
  tablePaymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "partial"],
    default: "unpaid"
  },
  
  // Amount paid per category
  roomAmountPaid: { type: Number, default: 0 },
  foodAmountPaid: { type: Number, default: 0 },
  tableAmountPaid: { type: Number, default: 0 },
  totalAmountPaid: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "pending"],
    default: "pending"
  },
  transactionId: String,
  paymentDate: Date,
  
  // Details
  items: Array,
  foodOrders: Array,
  tableBookings: Array,
  roomDetails: Object,
  billType: {
    type: String,
    enum: ["room", "food", "table", "combined"],
    default: "combined"
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Billing", billingSchema);