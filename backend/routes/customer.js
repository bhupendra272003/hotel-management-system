const router = require("express").Router();
const Booking = require("../models/Booking");
const Food = require("../models/Food");
const Table = require("../models/Table");
const Billing = require("../models/Billing");

// Public routes - No authentication needed

// Get available rooms
router.get("/available-rooms", async (req, res) => {
  const bookedRooms = await Booking.find({ 
    status: { $in: ["Booked", "CheckedIn"] } 
  });
  const bookedRoomNos = bookedRooms.map(b => b.roomNo);
  res.json({ bookedRooms: bookedRoomNos });
});

// Customer room booking
router.post("/book-room", async (req, res) => {
  const data = new Booking(req.body);
  await data.save();
  res.json({ success: true, booking: data });
});

// Customer food order
router.post("/order-food", async (req, res) => {
  const data = new Food(req.body);
  await data.save();
  res.json({ success: true, order: data });
});

// Customer table booking
router.post("/book-table", async (req, res) => {
  const data = new Table(req.body);
  await data.save();
  res.json({ success: true, booking: data });
});

// Get bill for customer
router.get("/bill/:roomNo", async (req, res) => {
  const bills = await Billing.find({ roomNo: req.params.roomNo });
  const foodOrders = await Food.find({ roomNo: req.params.roomNo });
  res.json({ bills, foodOrders });
});

// Customer payment
router.post("/pay-bill", async (req, res) => {
  const { roomNo, amount, paymentMethod } = req.body;
  const bill = new Billing({
    roomNo,
    total: amount,
    paymentMethod,
    status: "paid"
  });
  await bill.save();
  res.json({ success: true });
});

module.exports = router;