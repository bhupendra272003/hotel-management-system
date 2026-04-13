const User = require("../models/User");
const Task = require("../models/Task");

class TaskAssigner {
  constructor() {
    this.lastAssignedIndex = {};
  }

  /**
   * Get all active staff members by role
   */
  async getActiveStaff(role) {
    return await User.find({ 
      role: role, 
      isActive: true 
    });
  }

  /**
   * Get task count for each staff member
   */
  async getTaskCounts(staffIds) {
    const counts = {};
    for (const staffId of staffIds) {
      const count = await Task.countDocuments({
        assignedTo: staffId,
        status: { $in: ["pending", "in-progress"] }
      });
      counts[staffId.toString()] = count;
    }
    return counts;
  }

  /**
   * Get the least busy staff member
   */
  async getLeastBusyStaff(role) {
    const staff = await this.getActiveStaff(role);
    
    if (staff.length === 0) return null;
    if (staff.length === 1) return staff[0];
    
    const staffIds = staff.map(s => s._id.toString());
    const taskCounts = await this.getTaskCounts(staffIds);
    
    let minTasks = Infinity;
    let leastBusyStaff = staff[0];
    
    for (const staffMember of staff) {
      const count = taskCounts[staffMember._id.toString()] || 0;
      if (count < minTasks) {
        minTasks = count;
        leastBusyStaff = staffMember;
      }
    }
    
    return leastBusyStaff;
  }

  /**
   * Round-robin assignment (alternates between staff)
   */
  async getRoundRobinStaff(role) {
    const staff = await this.getActiveStaff(role);
    
    if (staff.length === 0) return null;
    if (staff.length === 1) return staff[0];
    
    if (!this.lastAssignedIndex[role]) {
      this.lastAssignedIndex[role] = 0;
    }
    
    const index = this.lastAssignedIndex[role] % staff.length;
    const assignedStaff = staff[index];
    
    this.lastAssignedIndex[role] = index + 1;
    
    return assignedStaff;
  }

  /**
   * Assign task to best available staff member
   */
  async assignTask(taskData, role, assignBy, method = 'round-robin') {
    try {
      let assignedStaff;
      
      if (method === 'round-robin') {
        assignedStaff = await this.getRoundRobinStaff(role);
      } else {
        assignedStaff = await this.getLeastBusyStaff(role);
      }
      
      if (!assignedStaff) {
        console.log(`No active ${role} found for task assignment`);
        return null;
      }
      
      const task = new Task({
        ...taskData,
        assignedTo: assignedStaff._id,
        assignedBy: assignBy,
        status: "pending",
        createdAt: new Date()
      });
      
      await task.save();
      
      console.log(`Task assigned to ${assignedStaff.name} (${role})`);
      
      return task;
    } catch (error) {
      console.error("Task assignment error:", error);
      return null;
    }
  }

  /**
   * Rebalance tasks among staff
   */
  async rebalanceTasks(role) {
    const staff = await this.getActiveStaff(role);
    if (staff.length <= 1) return;
    
    const pendingTasks = await Task.find({
      taskType: { $in: ["order_serve", "room_cleaning", "table_setup"] },
      status: { $in: ["pending", "in-progress"] }
    });
    
    if (pendingTasks.length === 0) return;
    
    const targetPerStaff = Math.ceil(pendingTasks.length / staff.length);
    const taskCounts = await this.getTaskCounts(staff.map(s => s._id.toString()));
    
    const overloadedStaff = [];
    const underloadedStaff = [];
    
    for (const staffMember of staff) {
      const count = taskCounts[staffMember._id.toString()] || 0;
      if (count > targetPerStaff + 1) {
        overloadedStaff.push({ staff: staffMember, count });
      } else if (count < targetPerStaff - 1) {
        underloadedStaff.push({ staff: staffMember, count });
      }
    }
    
    for (const overloaded of overloadedStaff) {
      const tasksToMove = await Task.find({
        assignedTo: overloaded.staff._id,
        status: "pending"
      }).limit(overloaded.count - targetPerStaff);
      
      for (const task of tasksToMove) {
        if (underloadedStaff.length > 0) {
          task.assignedTo = underloadedStaff[0].staff._id;
          await task.save();
          underloadedStaff[0].count++;
          if (underloadedStaff[0].count >= targetPerStaff) {
            underloadedStaff.shift();
          }
        }
      }
    }
  }
}

module.exports = new TaskAssigner();