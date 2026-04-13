const router = require("express").Router();
const Billing = require("../models/Billing");
const Booking = require("../models/Booking");
const Food = require("../models/Food");
const Table = require("../models/Table");

// ================= GET ROUTES =================

router.get("/", async (req, res) => {
  try {
    const bills = await Billing.find().sort({ createdAt: -1 });
    console.log(`Found ${bills.length} bills`);
    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/unpaid", async (req, res) => {
  try {
    const bills = await Billing.find({ paymentStatus: "unpaid" });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/paid", async (req, res) => {
  try {
    const bills = await Billing.find({ paymentStatus: "paid" });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= POST ROUTES =================

router.post("/generate-combined/:roomNo", async (req, res) => {
  try {
    const { roomNo } = req.params;
    const booking = await Booking.findOne({ roomNo });
    if (!booking) return res.status(404).json({ error: "No booking found" });

    const roomRate = booking.roomType === "Suite" ? 5000 : booking.roomType === "Deluxe" ? 3000 : 1500;
    const roomCharge = roomRate * booking.days;
    const foodOrders = await Food.find({ roomNo });
    const foodCharge = foodOrders.reduce((sum, f) => sum + (f.total || 0), 0);
    const subtotal = roomCharge + foodCharge;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    let bill = await Billing.findOne({ roomNo });
    const billData = {
      roomNo, guestName: booking.name, guestEmail: booking.email, guestPhone: booking.phone,
      roomCharge, foodCharge, tax, total,
      roomPaymentStatus: "unpaid", foodPaymentStatus: foodCharge === 0 ? "paid" : "unpaid",
      paymentStatus: "unpaid", totalAmountPaid: 0, remainingAmount: total,
      roomDetails: { roomType: booking.roomType, days: booking.days, checkInDate: booking.checkInDate, people: booking.people, bedType: booking.bedType },
      foodOrders: foodOrders.map(f => ({ id: f._id, items: f.items, total: f.total, paymentStatus: f.paymentStatus, date: f.createdAt }))
    };

    if (bill) { Object.assign(bill, billData); bill.updatedAt = new Date(); await bill.save(); }
    else { bill = new Billing(billData); await bill.save(); }
    res.json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/generate-table/:bookingId", async (req, res) => {
  try {
    const tableBooking = await Table.findById(req.params.bookingId);
    if (!tableBooking) return res.status(404).json({ error: "Table booking not found" });

    const subtotal = (tableBooking.advanceAmount || 500) + (tableBooking.totalOrderAmount || 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const shortId = tableBooking._id.toString().slice(-6);
    const roomNo = "TABLE-" + shortId;

    let bill = await Billing.findOne({ roomNo });
    const billData = {
      roomNo, guestName: tableBooking.name, guestEmail: tableBooking.email || "", guestPhone: tableBooking.phone || "",
      tableCharge: subtotal, tax, total,
      tablePaymentStatus: tableBooking.paymentStatus === "paid" ? "paid" : "unpaid",
      paymentStatus: tableBooking.paymentStatus === "paid" ? "paid" : "unpaid",
      totalAmountPaid: tableBooking.paymentStatus === "paid" ? total : 0,
      remainingAmount: tableBooking.paymentStatus === "paid" ? 0 : total,
      billType: "table",
      tableBookings: [{ id: tableBooking._id, name: tableBooking.name, tableNumber: tableBooking.tableNumber, persons: tableBooking.persons, time: tableBooking.time, date: tableBooking.date, amount: subtotal, orders: tableBooking.orders || [] }]
    };

    if (bill) { Object.assign(bill, billData); bill.updatedAt = new Date(); await bill.save(); }
    else { bill = new Billing(billData); await bill.save(); }
    res.json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= PAYMENT ROUTES =================

router.post("/pay-table/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod, transactionId } = req.body;
    const tableBooking = await Table.findById(bookingId);
    if (!tableBooking) return res.status(404).json({ error: "Table booking not found" });

    tableBooking.paymentStatus = "paid";
    tableBooking.paymentMethod = paymentMethod;
    tableBooking.transactionId = transactionId;
    tableBooking.paymentDate = new Date();
    tableBooking.bookingStatus = "occupied";
    await tableBooking.save();

    const subtotal = (tableBooking.advanceAmount || 500) + (tableBooking.totalOrderAmount || 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const shortId = tableBooking._id.toString().slice(-6);
    const roomNo = "TABLE-" + shortId;

    let bill = await Billing.findOne({ roomNo });
    if (bill) {
      bill.paymentStatus = "paid";
      bill.tablePaymentStatus = "paid";
      bill.totalAmountPaid = total;
      bill.remainingAmount = 0;
      bill.paymentMethod = paymentMethod;
      bill.transactionId = transactionId;
      bill.paymentDate = new Date();
      await bill.save();
    } else {
      bill = new Billing({
        roomNo, guestName: tableBooking.name, guestEmail: tableBooking.email || "", guestPhone: tableBooking.phone || "",
        tableCharge: subtotal, tax, total, tablePaymentStatus: "paid", paymentStatus: "paid",
        totalAmountPaid: total, remainingAmount: 0, paymentMethod, transactionId, paymentDate: new Date(),
        billType: "table",
        tableBookings: [{ id: tableBooking._id, name: tableBooking.name, tableNumber: tableBooking.tableNumber, persons: tableBooking.persons, time: tableBooking.time, date: tableBooking.date, amount: subtotal, orders: tableBooking.orders || [] }]
      });
      await bill.save();
    }
    res.json({ success: true, bill, tableBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/pay/:id", async (req, res) => {
  try {
    const bill = await Billing.findByIdAndUpdate(req.params.id, {
      paymentStatus: "paid",
      paymentMethod: req.body.paymentMethod || "cash",
      paymentDate: new Date(),
      updatedAt: new Date()
    }, { new: true });
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const bill = await Billing.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= STATISTICS =================

router.get("/statistics", async (req, res) => {
  try {
    const bills = await Billing.find();
    const foodOrders = await Food.find();
    const tableBookings = await Table.find();
    const bookings = await Booking.find();

    const totalRevenue = bills.reduce((s, b) => s + (b.totalAmountPaid || 0), 0);
    const pendingRevenue = bills.reduce((s, b) => s + (b.remainingAmount || 0), 0);
    const roomRevenue = bills.reduce((s, b) => s + (b.roomAmountPaid || 0), 0);
    const foodRevenue = bills.reduce((s, b) => s + (b.foodAmountPaid || 0), 0);
    const tableRevenue = bills.reduce((s, b) => s + (b.tableAmountPaid || 0), 0);

    res.json({
      revenue: { total: totalRevenue, pending: pendingRevenue, collected: totalRevenue - pendingRevenue, byCategory: { room: roomRevenue, food: foodRevenue, table: tableRevenue } },
      food: { totalOrders: foodOrders.length, paidOrders: foodOrders.filter(f => f.paymentStatus === "paid").length, totalValue: foodOrders.reduce((s, f) => s + (f.total || 0), 0) },
      tables: { totalBookings: tableBookings.length, confirmed: tableBookings.filter(t => t.bookingStatus === "occupied").length, paid: tableBookings.filter(t => t.paymentStatus === "paid").length, totalValue: tableBookings.reduce((s, t) => s + (t.advanceAmount + (t.totalOrderAmount || 0)), 0) },
      rooms: { totalBookings: bookings.length, activeCheckins: bookings.filter(b => b.status === "CheckedIn").length, completed: bookings.filter(b => b.status === "Completed").length },
      recentTransactions: bills.filter(b => b.paymentStatus === "paid").slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;