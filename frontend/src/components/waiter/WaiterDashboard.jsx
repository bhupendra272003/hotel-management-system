import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import API_URL from "../../api/config";

export default function WaiterDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    pendingTasks: 0, inProgressTasks: 0, completedToday: 0, urgentTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskNotes, setTaskNotes] = useState("");
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/user/${user?._id}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [user?._id]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/user/${user?._id}`);
      const tasksData = res.data;
      setStats({
        pendingTasks: tasksData.filter(t => t.status === "pending").length,
        inProgressTasks: tasksData.filter(t => t.status === "in-progress").length,
        completedToday: tasksData.filter(t => t.status === "completed" && new Date(t.completedAt).toDateString() === new Date().toDateString()).length,
        urgentTasks: tasksData.filter(t => t.priority === "urgent" && t.status !== "completed").length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchTasks();
      fetchStats();
      setLoading(false);
    }
  }, [user, fetchTasks, fetchStats]);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { status, completedAt: status === "completed" ? new Date() : null });
      fetchTasks();
      fetchStats();
      alert(`Task marked as ${status}!`);
    } catch (error) {
      alert("Failed to update task");
    }
  };

  const addTaskNote = async () => {
    if (!taskNotes) return;
    try {
      await axios.put(`${API_URL}/tasks/${selectedTask._id}`, { notes: taskNotes, status: "in-progress" });
      setShowTaskModal(false);
      setTaskNotes("");
      fetchTasks();
      alert("Task note added and marked as in-progress!");
    } catch (error) {
      alert("Failed to add note");
    }
  };

  const getTaskIcon = (type) => {
    switch(type) {
      case "room_cleaning": return "🧹";
      case "order_serve": return "🍕";
      case "table_setup": return "🍽️";
      case "linen_change": return "🛏️";
      case "minibar_refill": return "🥤";
      case "guest_request": return "🙏";
      default: return "📋";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "urgent": return "#dc3545";
      case "high": return "#fd7e14";
      case "medium": return "#ffc107";
      default: return "#28a745";
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending": return { text: "⏳ Pending", color: "#ffc107", bg: "#fff3cd" };
      case "in-progress": return { text: "🔄 In Progress", color: "#17a2b8", bg: "#d1ecf1" };
      case "completed": return { text: "✅ Completed", color: "#28a745", bg: "#d4edda" };
      default: return { text: "❌ Cancelled", color: "#dc3545", bg: "#f8d7da" };
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading tasks...</div>;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '20px', background: 'var(--bg-card)', borderRadius: '15px', marginBottom: '30px' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.8rem' }}>🍽️ Waiter Dashboard</h1><p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>Welcome, {user?.name || 'Waiter'}! Here are your tasks for today</p></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/waiter/profile" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', textDecoration: 'none', borderRadius: '40px' }}>👤 My Profile</Link>
          <ThemeToggle />
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>🚪 Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>⏳</div><h3>Pending Tasks</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pendingTasks}</p></div>
        <div style={{ background: 'linear-gradient(135deg, #17a2b8, #138496)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>🔄</div><h3>In Progress</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.inProgressTasks}</p></div>
        <div style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>✅</div><h3>Completed Today</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.completedToday}</p></div>
        <div style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>⚠️</div><h3>Urgent Tasks</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.urgentTasks}</p></div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '15px', padding: '20px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#dc3c3c' }}>📋 My Tasks</h2>
        {tasks.length === 0 ? <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No tasks assigned yet. Check back later!</p> : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {tasks.map(task => {
              const statusBadge = getStatusBadge(task.status);
              return (
                <div key={task._id} style={{ background: 'var(--bg-glass)', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{getTaskIcon(task.taskType)}</span>
                        <h3 style={{ margin: 0 }}>{task.title}</h3>
                        {task.priority === "urgent" && <span style={{ background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>URGENT</span>}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{task.description}</p>
                      {task.roomNo && <p><strong>📍 Room:</strong> {task.roomNo}</p>}
                      {task.tableId && <p><strong>🍽️ Table:</strong> {task.tableId}</p>}
                      {task.notes && <p><strong>📝 Notes:</strong> {task.notes}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: statusBadge.bg, color: statusBadge.color, marginBottom: '10px' }}>{statusBadge.text}</span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        {task.status === "pending" && <><button onClick={() => updateTaskStatus(task._id, "in-progress")} style={{ padding: '6px 12px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Start Task</button>
                        <button onClick={() => { setSelectedTask(task); setShowTaskModal(true); }} style={{ padding: '6px 12px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Add Note</button></>}
                        {task.status === "in-progress" && <><button onClick={() => updateTaskStatus(task._id, "completed")} style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Mark Complete</button>
                        <button onClick={() => { setSelectedTask(task); setTaskNotes(task.notes || ""); setShowTaskModal(true); }} style={{ padding: '6px 12px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Update Note</button></>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '20px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ color: '#dc3c3c', marginBottom: '20px' }}>{selectedTask?.notes ? "Update Task Note" : "Add Task Note"}</h3>
            <textarea value={taskNotes} onChange={(e) => setTaskNotes(e.target.value)} placeholder="Add details about the task..." rows="5" style={{ width: '100%', padding: '12px', border: '2px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-glass)', color: 'var(--text-primary)', marginBottom: '20px', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={addTaskNote} style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Save Note</button>
              <button onClick={() => { setShowTaskModal(false); setTaskNotes(""); }} style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}