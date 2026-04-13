const router = require("express").Router();
const Task = require("../models/Task");
const User = require("../models/User");
const taskAssigner = require("../services/taskAssigner");

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name role").populate("assignedBy", "name");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === "undefined") {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const tasks = await Task.find({ assignedTo: userId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post("/", async (req, res) => {
  try {
    const { title, description, assignedTo, assignedBy, taskType, roomNo, tableId, orderId, priority, notes } = req.body;
    
    if (!assignedTo || assignedTo === "undefined") {
      return res.status(400).json({ error: "Invalid assignedTo ID" });
    }
    
    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: assignedBy || null,
      taskType: taskType || "general",
      roomNo,
      tableId,
      orderId,
      status: "pending",
      priority: priority || "medium",
      notes: notes || ""
    });
    
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rebalance tasks among staff (Admin only)
router.post("/rebalance", async (req, res) => {
  try {
    await taskAssigner.rebalanceTasks("waiter");
    await taskAssigner.rebalanceTasks("receptionist");
    res.json({ success: true, message: "Tasks rebalanced successfully" });
  } catch (error) {
    console.error("Rebalance error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get task distribution stats
router.get("/distribution", async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ["waiter", "receptionist"] }, isActive: true });
    const tasks = await Task.find();
    
    const distribution = staff.map(member => ({
      _id: member._id,
      name: member.name,
      role: member.role,
      pendingTasks: tasks.filter(t => t.assignedTo?.toString() === member._id.toString() && t.status === "pending").length,
      inProgressTasks: tasks.filter(t => t.assignedTo?.toString() === member._id.toString() && t.status === "in-progress").length,
      completedTasks: tasks.filter(t => t.assignedTo?.toString() === member._id.toString() && t.status === "completed").length,
      totalTasks: tasks.filter(t => t.assignedTo?.toString() === member._id.toString()).length
    }));
    
    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;