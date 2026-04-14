import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function CustomerBooking() {
  const [form, setForm] = useState({
    name: "", email: "", aadhar: "", gender: "Male", age: "",
    roomNo: "", roomType: "Standard", bedType: "Single", people: 1, days: 1
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchAvailableRooms(); }, []);

  const fetchAvailableRooms = async () => {
    try {
      const res = await axios.get(`${API_URL}/booking`);
      const bookedRooms = res.data.filter(b => b.status === "Booked" || b.status === "CheckedIn").map(b => b.roomNo);
      const allRooms = ["101", "102", "103", "104", "105", "201", "202", "203", "204", "205"];
      setAvailableRooms(allRooms.filter(room => !bookedRooms.includes(room)));
    } catch (error) { console.error(error); }
  };

  const submit = async () => {
    try {
      await axios.post(`${API_URL}/booking`, form);
      alert("Room Booked Successfully!");
      navigate("/");
    } catch (error) { alert("Booking failed!"); }
  };

  return (
    <div className="booking-form" style={{ maxWidth: "600px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>📅 Room Booking</h2>
      <input placeholder="Full Name" onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
      <input placeholder="Aadhar Number" onChange={e => setForm({ ...form, aadhar: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
      <select onChange={e => setForm({ ...form, gender: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
        <option>Male</option><option>Female</option><option>Other</option>
      </select>
      <input placeholder="Age" type="number" onChange={e => setForm({ ...form, age: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
      <select onChange={e => setForm({ ...form, roomNo: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
        <option value="">Select Room</option>
        {availableRooms.map(room => <option key={room} value={room}>Room {room}</option>)}
      </select>
      <select onChange={e => setForm({ ...form, roomType: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
        <option>Standard</option><option>Deluxe</option><option>Suite</option>
      </select>
      <select onChange={e => setForm({ ...form, bedType: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
        <option>Single</option><option>Double</option><option>King</option>
      </select>
      <input placeholder="Number of People" type="number" onChange={e => setForm({ ...form, people: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
      <input placeholder="Number of Days" type="number" onChange={e => setForm({ ...form, days: e.target.value })} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
      <button onClick={submit} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #dc3c3c, #b83232)", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginTop: "20px" }}>Book Room</button>
      <button onClick={() => navigate("/")} style={{ width: "100%", padding: "12px", marginTop: "10px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Back to Home</button>
    </div>
  );
}