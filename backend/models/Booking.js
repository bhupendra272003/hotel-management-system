const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  aadhar: String,
  gender: String,
  age: Number,
  roomNo: String,
  roomType: String,
  bedType: String,
  people: Number,
  days: Number,
  status: { type: String, default: "Booked" }
});

module.exports = mongoose.model("Booking", bookingSchema);