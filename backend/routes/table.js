const router = require("express").Router();
const Table = require("../models/Table");
const Task = require("../models/Task");
const User = require("../models/User");
const taskAssigner = require("../services/taskAssigner");

// GET all tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: -1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET table by ID
router.get("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET available tables
router.get("/available", async (req, res) => {
  try {
    const tables = await Table.find({ bookingStatus: "available" });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET table orders
router.get("/orders/:tableId", async (req, res) => {
  try {
    const table = await Table.findById(req.params.tableId);
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json({ orders: table.orders, totalAmount: table.totalOrderAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BOOK TABLE
router.post("/", async (req, res) => {
  try {
    const { tableNumber, name, email, phone, persons, time, date, specialRequests } = req.body;

    if (!tableNumber || !name || !persons || !time || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Table.findOne({
      tableNumber,
      bookingStatus: { $in: ["booked", "occupied"] }
    });

    if (existing) {
      return res.status(400).json({ error: `Table ${tableNumber} is already booked or occupied` });
    }

    let table = await Table.findOne({ tableNumber, bookingStatus: "available" });

    if (table) {
      table.name = name;
      table.email = email || "";
      table.phone = phone || "";
      table.persons = parseInt(persons);
      table.time = time;
      table.date = date;
      table.specialRequests = specialRequests || "";
      table.bookingStatus = "booked";
      table.paymentStatus = "unpaid";
      table.orders = [];
      table.totalOrderAmount = 0;
      table.totalAmount = 500;
      table.updatedAt = new Date();
      await table.save();
    } else {
      table = new Table({
        tableNumber,
        name,
        email: email || "",
        phone: phone || "",
        persons: parseInt(persons),
        time,
        date,
        specialRequests: specialRequests || "",
        bookingStatus: "booked",
        paymentStatus: "unpaid",
        advanceAmount: 500,
        orders: []
      });
      await table.save();
    }

    res.json({ success: true, message: `Table ${tableNumber} booked successfully!`, table });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ADD FOOD ORDER with equal waiter assignment
router.post("/add-order/:tableId", async (req, res) => {
  try {
    const { itemName, quantity, price, notes } = req.body;
    const { tableId } = req.params;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    if (table.bookingStatus !== "occupied" && table.bookingStatus !== "booked") {
      return res.status(400).json({ 
        error: "Table must be booked or occupied to place orders" 
      });
    }

    const total = quantity * price;

    const order = {
      itemName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      total,
      orderedAt: new Date(),
      status: "pending",
      notes: notes || ""
    };

    table.orders.push(order);
    
    let totalOrderAmount = 0;
    for (let i = 0; i < table.orders.length; i++) {
      totalOrderAmount += table.orders[i].total;
    }
    table.totalOrderAmount = totalOrderAmount;
    table.totalAmount = (table.advanceAmount || 500) + totalOrderAmount;
    table.updatedAt = new Date();
    await table.save();

    // Assign task to waiter using round-robin (equal distribution)
    const task = await taskAssigner.assignTask(
      {
        title: `New order for Table ${table.tableNumber}`,
        description: `${itemName} x ${quantity} - ₹${total}`,
        taskType: "order_serve",
        tableId: table._id,
        priority: "high",
        notes: `Customer: ${table.name}, Table: ${table.tableNumber}`
      },
      "waiter",
      req.body.assignedBy || null,
      "round-robin"
    );

    res.json({ 
      success: true, 
      message: "Order added successfully",
      table,
      order,
      assignedTo: task?.assignedTo
    });

  } catch (error) {
    console.error("Add order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE ORDER STATUS
router.put("/update-order/:tableId/:orderId", async (req, res) => {
  try {
    const { tableId, orderId } = req.params;
    const { status } = req.body;

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ error: "Table not found" });

    const order = table.orders.id(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    order.updatedAt = new Date();
    table.updatedAt = new Date();
    await table.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MARK TABLE AS OCCUPIED
router.put("/occupy/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { bookingStatus: "occupied", updatedAt: new Date() },
      { new: true }
    );
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json({ success: true, table });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FREE TABLE
router.put("/free/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { bookingStatus: "available", updatedAt: new Date() },
      { new: true }
    );
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json({ success: true, table });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE TABLE
router.delete("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;