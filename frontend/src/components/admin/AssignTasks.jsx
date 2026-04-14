import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function AssignTasks() {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium"
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchStaff();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/staff");
      setStaff(res.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const assignTask = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/tasks", newTask);
      alert("✅ Task assigned successfully!");
      setNewTask({ title: "", description: "", assignedTo: "", priority: "medium" });
      fetchTasks();
    } catch (error) {
      alert("Failed to assign task");
    }
  };

  const updateTaskStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "#ff4444";
      case "medium": return "#ffaa00";
      case "low": return "#44aa44";
      default: return "#999";
    }
  };

  return (
    <div className="assign-tasks">
      <h2>✅ Assign Tasks to Staff</h2>
      
      <div className="new-task">
        <h3>Create New Task</h3>
        <input 
          placeholder="Task Title *" 
          onChange={e => setNewTask({...newTask, title: e.target.value})}
          value={newTask.title}
        />
        <textarea 
          placeholder="Task Description" 
          onChange={e => setNewTask({...newTask, description: e.target.value})}
          value={newTask.description}
          rows="3"
        />
        <select onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} value={newTask.assignedTo}>
          <option value="">Assign to Staff Member *</option>
          {staff.map(s => (
            <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
          ))}
        </select>
        <select onChange={e => setNewTask({...newTask, priority: e.target.value})} value={newTask.priority}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button onClick={assignTask}>Assign Task</button>
      </div>
      
      <div className="tasks-list">
        <h3>Active Tasks</h3>
        {tasks.length === 0 ? (
          <p>No active tasks</p>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task._id} className="task-card" style={{borderLeftColor: getPriorityColor(task.priority)}}>
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
                <p className="task-desc">{task.description}</p>
                <p className="task-assignee">
                  <strong>Assigned to:</strong> {task.assignedTo?.name || "Unknown"}
                </p>
                <p className="task-status">
                  <strong>Status:</strong> {task.status}
                </p>
                <div className="task-actions">
                  {task.status === "pending" && (
                    <button onClick={() => updateTaskStatus(task._id, "in-progress")}>Start Task</button>
                  )}
                  {task.status === "in-progress" && (
                    <button onClick={() => updateTaskStatus(task._id, "completed")}>Complete Task</button>
                  )}
                  <button onClick={() => deleteTask(task._id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button onClick={() => navigate("/admin")} className="back-btn">Back to Dashboard</button>
    </div>
  );
}
