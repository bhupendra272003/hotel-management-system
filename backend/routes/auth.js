const router = require("express").Router();
const User = require("../models/User");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Check for admin hardcoded first
  if (email === "admin@hotel.com" && password === "admin123") {
    let admin = await User.findOne({ email: "admin@hotel.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin User",
        email: "admin@hotel.com",
        password: "admin123",
        role: "admin",
        phone: "9999999999",
        salary: 50000,
        isActive: true
      });
    }
    await User.findByIdAndUpdate(admin._id, { lastLogin: new Date() });
    return res.json({ 
      success: true, 
      role: "admin",
      user: { 
        _id: admin._id,
        name: admin.name, 
        email: admin.email, 
        role: admin.role,
        phone: admin.phone,
        joinDate: admin.joinDate
      }
    });
  }
  
  // Check database for other users
  const user = await User.findOne({ email, isActive: true });
  if (user && user.password === password) {
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    res.json({ 
      success: true, 
      role: user.role,
      user: { 
        _id: user._id,
        name: user.name, 
        email: user.email, 
        role: user.role,
        phone: user.phone,
        joinDate: user.joinDate
      }
    });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// Get user profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put("/profile/:userId", async (req, res) => {
  try {
    const { name, phone, address, salary } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, phone, address, salary, updatedAt: new Date() },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.put("/change-password/:userId", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    console.log("Password change request for user:", req.params.userId);
    
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check current password
    if (user.password !== currentPassword) {
      console.log("Password mismatch");
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
    
    // Update password
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    
    console.log("Password updated successfully for user:", user.email);
    
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all staff (admin only)
router.get("/staff", async (req, res) => {
  try {
    const staff = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register new staff (admin only)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, salary } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    const user = new User({ name, email, password, role, phone, salary });
    await user.save();
    
    res.json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update staff (admin only)
router.put("/staff/:id", async (req, res) => {
  try {
    const { name, email, role, phone, salary, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, phone, salary, isActive, updatedAt: new Date() },
      { new: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete staff (admin only)
router.delete("/staff/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password for staff (admin only)
router.put("/reset-password/:id", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
