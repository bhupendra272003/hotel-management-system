const router = require("express").Router();
const Food = require("../models/Food");
const Table = require("../models/Table");
const taskAssigner = require("../services/taskAssigner");

// Get all food orders
router.get("/", async (req, res) => {
  try {
    const orders = await Food.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by room
router.get("/room/:roomNo", async (req, res) => {
  try {
    const orders = await Food.find({ 
      roomNo: req.params.roomNo,
      paymentStatus: "unpaid"
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create food order for room delivery with equal task assignment
router.post("/", async (req, res) => {
  try {
    const { roomNo, items, total, orderType, customerName, customerPhone } = req.body;
    
    const foodOrder = new Food({
      roomNo: roomNo || null,
      items,
      total,
      orderType: orderType || (roomNo ? "room_delivery" : "dine_in"),
      customerName,
      customerPhone,
      status: "pending",
      paymentStatus: "unpaid"
    });
    await foodOrder.save();
    
    // Assign task to waiter using round-robin (equal distribution)
    const task = await taskAssigner.assignTask(
      {
        title: orderType === "room_delivery" ? `Deliver Food to Room ${roomNo}` : `Serve Food`,
        description: `Order items: ${items.join(", ")}. Total: ₹${total}`,
        taskType: "order_serve",
        roomNo: roomNo || null,
        orderId: foodOrder._id,
        priority: "high",
        notes: `Customer: ${customerName || "Guest"}, Phone: ${customerPhone || "N/A"}`
      },
      "waiter",
      req.body.assignedBy || null,
      "round-robin"
    );
    
    res.json({ success: true, order: foodOrder, assignedTo: task?.assignedTo });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Order food for a table (dine-in) with equal task assignment
router.post("/table-order", async (req, res) => {
  try {
    const { tableNumber, items, total, customerName, customerPhone } = req.body;
    
    const table = await Table.findOne({ tableNumber, bookingStatus: "occupied" });
    if (!table) {
      return res.status(400).json({ error: "Table is not occupied" });
    }

    const foodOrder = new Food({
      tableId: table._id,
      tableNumber,
      items,
      total,
      orderType: "dine_in",
      customerName,
      customerPhone,
      status: "pending",
      paymentStatus: "unpaid"
    });
    await foodOrder.save();

    // Assign task to waiter using round-robin
    const task = await taskAssigner.assignTask(
      {
        title: `Serve food at Table ${tableNumber}`,
        description: `Items: ${items.join(", ")}. Total: ₹${total}`,
        taskType: "order_serve",
        tableId: table._id,
        orderId: foodOrder._id,
        priority: "high",
        notes: `Customer: ${customerName || "Guest"}, Phone: ${customerPhone || "N/A"}`
      },
      "waiter",
      req.body.assignedBy || null,
      "round-robin"
    );

    res.json({ success: true, order: foodOrder, assignedTo: task?.assignedTo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Pay for food order
router.post("/pay/:id", async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    const order = await Food.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    order.paymentStatus = "paid";
    order.paymentMethod = paymentMethod;
    order.transactionId = transactionId;
    order.paymentDate = new Date();
    order.status = "confirmed";
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put("/:id", async (req, res) => {
  try {
    const order = await Food.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;