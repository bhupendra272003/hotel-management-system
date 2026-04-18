import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "", email: "", password: "", role: "receptionist", phone: "", salary: ""
  });
  const navigate = useNavigate();

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/staff`);
      setStaff(res.data);
    } catch (error) { console.error(error); }
  };

  const addStaff = async () => {
    await axios.post(`${API_URL}/auth/register`, newStaff);
    alert("Staff added successfully!");
    fetchStaff();
    setNewStaff({ name: "", email: "", password: "", role: "receptionist", phone: "", salary: "" });
  };

  const deleteStaff = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`${API_URL}/auth/staff/${id}`);
      fetchStaff();
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>👥 Manage Staff</h2>
      
      <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "15px", marginBottom: "30px" }}>
        <h3>Add New Staff</h3>
        <input placeholder="Name" onChange={e => setNewStaff({...newStaff, name: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <input placeholder="Email" onChange={e => setNewStaff({...newStaff, email: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <input placeholder="Password" type="password" onChange={e => setNewStaff({...newStaff, password: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <select onChange={e => setNewStaff({...newStaff, role: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
          <option value="receptionist">Receptionist</option>
          <option value="waiter">Waiter</option>
        </select>
        <input placeholder="Phone" onChange={e => setNewStaff({...newStaff, phone: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <input placeholder="Salary" onChange={e => setNewStaff({...newStaff, salary: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <button onClick={addStaff} style={{ padding: "12px 24px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "10px" }}>Add Staff</button>
      </div>
      
      <div className="staff-list">
        <h3>Current Staff</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg-card)", borderRadius: "12px", overflow: "hidden" }}>
          <thead><tr style={{ background: "#dc3c3c", color: "white" }}><th style={{ padding: "12px" }}>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Salary</th><th>Action</th></tr></thead>
          <tbody>
            {staff.map(s => (
              <tr key={s._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px" }}>{s.name}</td><td>{s.email}</td><td>{s.role}</td><td>{s.phone}</td><td>₹{s.salary}</td>
                <td><button onClick={() => deleteStaff(s._id)} style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button onClick={() => navigate("/admin")} style={{ marginTop: "20px", padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>← Back to Dashboard</button>
    </div>
  );
}