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
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/staff`);
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
      await axios.post(`${API_URL}/tasks`, newTask);
      alert("✅ Task assigned successfully!");
      setNewTask({ title: "", description: "", assignedTo: "", priority: "medium" });
      fetchTasks();
    } catch (error) {
      alert("Failed to assign task");
    }
  };

  const updateTaskStatus = async (id, status) => {
    await axios.put(`${API_URL}/tasks/${id}`, { status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      await axios.delete(`${API_URL}/tasks/${id}`);
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
    <div className="assign-tasks" style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>✅ Assign Tasks to Staff</h2>
      
      <div className="new-task" style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "15px", marginBottom: "30px" }}>
        <h3>Create New Task</h3>
        <input placeholder="Task Title *" onChange={e => setNewTask({...newTask, title: e.target.value})} value={newTask.title} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <textarea placeholder="Task Description" onChange={e => setNewTask({...newTask, description: e.target.value})} value={newTask.description} rows="3" style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <select onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} value={newTask.assignedTo} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
          <option value="">Assign to Staff Member *</option>
          {staff.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role})</option>)}
        </select>
        <select onChange={e => setNewTask({...newTask, priority: e.target.value})} value={newTask.priority} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button onClick={assignTask} style={{ padding: "12px 24px", background: "#dc3c3c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "10px" }}>Assign Task</button>
      </div>
      
      <div className="tasks-list">
        <h3>Active Tasks</h3>
        {tasks.length === 0 ? <p>No active tasks</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
            {tasks.map(task => (
              <div key={task._id} style={{ background: "var(--bg-card)", borderRadius: "12px", padding: "15px", borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4>{task.title}</h4>
                  <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "11px", background: task.priority === "high" ? "#ff4444" : task.priority === "medium" ? "#ffaa00" : "#44aa44", color: "white" }}>{task.priority}</span>
                </div>
                <p>{task.description}</p>
                <p><strong>Assigned to:</strong> {task.assignedTo?.name || "Unknown"}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  {task.status === "pending" && <button onClick={() => updateTaskStatus(task._id, "in-progress")} style={{ padding: "6px 12px", background: "#17a2b8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Start</button>}
                  {task.status === "in-progress" && <button onClick={() => updateTaskStatus(task._id, "completed")} style={{ padding: "6px 12px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Complete</button>}
                  <button onClick={() => deleteTask(task._id)} style={{ padding: "6px 12px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button onClick={() => navigate("/admin")} style={{ marginTop: "30px", padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>← Back to Dashboard</button>
    </div>
  );
}