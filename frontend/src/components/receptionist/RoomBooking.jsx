import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RoomBooking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    gender: "Male",
    age: "",
    roomNo: "",
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
    try {
      const res = await axios.get("http://localhost:5000/api/booking");
      const bookedRooms = res.data.filter(b => b.status === "Booked" || b.status === "CheckedIn").map(b => b.roomNo);
      const allRooms = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210"];
      const available = allRooms.filter(room => !bookedRooms.includes(room));
      setAvailableRooms(available);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const getRoomPrice = () => {
    switch(form.roomType) {
      case "Standard": return 1500;
      case "Deluxe": return 3000;
      case "Suite": return 5000;
      default: return 1500;
    }
  };

  const totalPrice = getRoomPrice() * form.days;

  const submit = async () => {
    if (!form.name || !form.email || !form.roomNo) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/booking", form);
      alert(`✅ Room Booked Successfully!\nRoom: ${form.roomNo}\nDays: ${form.days}\nTotal: ₹${totalPrice}`);
      navigate("/receptionist");
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="room-booking">
      <h2>📅 New Room Booking</h2>
      
      <div className="form-group">
        <input placeholder="Guest Full Name *" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email *" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone Number" onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Aadhar Number *" onChange={e => setForm({ ...form, aadhar: e.target.value })} />
        
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
          <option value="">Select Available Room *</option>
          {availableRooms.map(room => (
            <option key={room} value={room}>Room {room}</option>
          ))}
        </select>
        
        <input placeholder="Number of People" type="number" onChange={e => setForm({ ...form, people: e.target.value })} />
        <input placeholder="Number of Days" type="number" onChange={e => setForm({ ...form, days: e.target.value })} />
        <input type="date" onChange={e => setForm({ ...form, checkInDate: e.target.value })} />
        
        <div className="price-summary">
          <h3>Booking Summary</h3>
          <p>Room Type: {form.roomType}</p>
          <p>Rate: ₹{getRoomPrice()}/day</p>
          <p>Days: {form.days}</p>
          <p><strong>Total: ₹{totalPrice}</strong></p>
        </div>
        
        <button onClick={submit}>Confirm Booking</button>
        <button onClick={() => navigate("/receptionist")} className="back-btn">Back to Dashboard</button>
      </div>
    </div>
  );
}