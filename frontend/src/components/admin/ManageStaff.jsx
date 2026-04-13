import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "receptionist",
    phone: "",
    salary: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/staff");
    setStaff(res.data);
  };

  const addStaff = async () => {
    await axios.post("http://localhost:5000/api/auth/register", newStaff);
    alert("Staff added successfully!");
    fetchStaff();
    setNewStaff({ name: "", email: "", password: "", role: "receptionist", phone: "", salary: "" });
  };

  const deleteStaff = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`http://localhost:5000/api/auth/staff/${id}`);
      fetchStaff();
    }
  };

  return (
    <div className="manage-staff">
      <h2>👥 Manage Staff</h2>
      
      <div className="add-staff">
        <h3>Add New Staff</h3>
        <input placeholder="Name" onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
        <input placeholder="Email" onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
        <input placeholder="Password" type="password" onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
        <select onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
          <option value="receptionist">Receptionist</option>
          <option value="waiter">Waiter</option>
        </select>
        <input placeholder="Phone" onChange={e => setNewStaff({...newStaff, phone: e.target.value})} />
        <input placeholder="Salary" onChange={e => setNewStaff({...newStaff, salary: e.target.value})} />
        <button onClick={addStaff}>Add Staff</button>
      </div>
      
      <div className="staff-list">
        <h3>Current Staff</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Salary</th><th>Action</th></tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.role}</td>
                <td>{s.phone}</td>
                <td>₹{s.salary}</td>
                <td><button onClick={() => deleteStaff(s._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button onClick={() => navigate("/admin")}>Back to Dashboard</button>
    </div>
  );
}