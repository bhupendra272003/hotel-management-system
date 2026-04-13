import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerBooking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    gender: "Male",
    age: "",
    roomType: "Standard",
    bedType: "Single",
    people: 1,
    days: 1,
    checkInDate: "",
    status: "Booked"
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    const res = await axios.get("http://localhost:5000/api/customer/available-rooms");
    const allRooms = ["101", "102", "103", "104", "105", "201", "202", "203", "204", "205"];
    const available = allRooms.filter(room => !res.data.bookedRooms.includes(room));
    setAvailableRooms(available);
  };

  const submit = async () => {
    if (!form.roomNo) {
      alert("Please select a room number");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/customer/book-room", form);
      alert("🎉 Room Booked Successfully! Please proceed to reception for check-in.");
      navigate("/");
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="customer-booking">
      <h2>📅 Book a Room</h2>
      <input placeholder="Full Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone Number" onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Aadhar Number" onChange={e => setForm({ ...form, aadhar: e.target.value })} />
      
      <select onChange={e => setForm({ ...form, gender: e.target.value })}>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      
      <input placeholder="Age" type="number" onChange={e => setForm({ ...form, age: e.target.value })} />
      
      <select onChange={e => setForm({ ...form, roomType: e.target.value })}>
        <option>Standard (₹1500/day)</option>
        <option>Deluxe (₹3000/day)</option>
        <option>Suite (₹5000/day)</option>
      </select>
      
      <select onChange={e => setForm({ ...form, bedType: e.target.value })}>
        <option>Single</option>
        <option>Double</option>
        <option>King</option>
      </select>
      
      <select onChange={e => setForm({ ...form, roomNo: e.target.value })}>
        <option value="">Select Available Room</option>
        {availableRooms.map(room => (
          <option key={room} value={room}>Room {room}</option>
        ))}
      </select>
      
      <input placeholder="Number of People" type="number" onChange={e => setForm({ ...form, people: e.target.value })} />
      <input placeholder="Number of Days" type="number" onChange={e => setForm({ ...form, days: e.target.value })} />
      <input type="date" onChange={e => setForm({ ...form, checkInDate: e.target.value })} />
      
      <button onClick={submit}>Confirm Booking</button>
      <button onClick={() => navigate("/")} className="back-btn">Back to Home</button>
    </div>
  );
}