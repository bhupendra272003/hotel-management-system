import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function TaskDistribution() {
  const [staff, setStaff] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffAndTasks();
  }, []);

  const fetchStaffAndTasks = async () => {
    try {
      const [staffRes, tasksRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/staff"),
        axios.get("http://localhost:5000/api/tasks")
      ]);
      
      setStaff(staffRes.data);
      
      const stats = staffRes.data.map(staffMember => {
        const staffTasks = tasksRes.data.filter(t => t.assignedTo?._id === staffMember._id);
        return {
          ...staffMember,
          pendingTasks: staffTasks.filter(t => t.status === "pending").length,
          inProgressTasks: staffTasks.filter(t => t.status === "in-progress").length,
          completedTasks: staffTasks.filter(t => t.status === "completed").length,
          totalTasks: staffTasks.length
        };
      });
      
      setTaskStats(stats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const rebalanceTasks = async () => {
    try {
      await axios.post("http://localhost:5000/api/tasks/rebalance");
      alert("Tasks rebalanced successfully!");
      fetchStaffAndTasks();
    } catch (error) {
      alert("Failed to rebalance tasks");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div className="loading-spinner"></div>
        <p>Loading task distribution...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
        <h2 style={{ margin: 0, color: "#dc3c3c" }}>📊 Task Distribution</h2>
        <button 
          onClick={rebalanceTasks} 
          style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          🔄 Rebalance Tasks
        </button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {taskStats.map((staffMember) => (
          <div key={staffMember._id} style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            borderLeft: `4px solid ${staffMember.pendingTasks > 0 ? "#ff9800" : "#28a745"}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "20px"
              }}>
                {staffMember.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{staffMember.name}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: "12px", textTransform: "capitalize" }}>{staffMember.role}</p>
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
              <div style={{ textAlign: "center", padding: "10px", background: "#fff3cd", borderRadius: "8px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>{staffMember.pendingTasks}</div>
                <div style={{ fontSize: "12px" }}>Pending</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px", background: "#d1ecf1", borderRadius: "8px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#17a2b8" }}>{staffMember.inProgressTasks}</div>
                <div style={{ fontSize: "12px" }}>In Progress</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px", background: "#d4edda", borderRadius: "8px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>{staffMember.completedTasks}</div>
                <div style={{ fontSize: "12px" }}>Completed</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px", background: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6c757d" }}>{staffMember.totalTasks}</div>
                <div style={{ fontSize: "12px" }}>Total Tasks</div>
              </div>
            </div>
            
            <div style={{ height: "8px", background: "#e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${(staffMember.completedTasks / (staffMember.totalTasks || 1)) * 100}%`,
                height: "100%",
                background: "#28a745",
                borderRadius: "4px"
              }}></div>
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px", textAlign: "center" }}>
              Completion Rate: {((staffMember.completedTasks / (staffMember.totalTasks || 1)) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button 
          onClick={() => navigate("/admin")} 
          style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
