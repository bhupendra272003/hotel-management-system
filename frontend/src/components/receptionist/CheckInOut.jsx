import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckInOut() {
  const [bookings, setBookings] = useState([]);
  const [checkedIn, setCheckedIn] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/booking");
      const pendingCheckIns = res.data.filter(b => b.status === "Booked");
      const activeCheckIns = res.data.filter(b => b.status === "CheckedIn");
      setBookings(pendingCheckIns);
      setCheckedIn(activeCheckIns);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const checkIn = async (id, roomNo, name) => {
    if (window.confirm(`Check in ${name} to Room ${roomNo}?`)) {
      await axios.put(`http://localhost:5000/api/booking/checkin/${id}`);
      alert(`✅ ${name} checked in successfully to Room ${roomNo}`);
      fetchData();
    }
  };

  const checkOut = async (id, roomNo, name) => {
    const totalDays = bookings.find(b => b._id === id)?.days || 1;
    const roomRate = bookings.find(b => b._id === id)?.roomType === "Suite" ? 5000 : 
                     bookings.find(b => b._id === id)?.roomType === "Deluxe" ? 3000 : 1500;
    const totalAmount = totalDays * roomRate;
    
    if (window.confirm(`Check out ${name} from Room ${roomNo}?\nTotal amount: ₹${totalAmount}`)) {
      await axios.put(`http://localhost:5000/api/booking/checkout/${id}`);
      alert(`✅ ${name} checked out successfully`);
      fetchData();
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="checkinout">
      <h2>✅ Check In / Check Out</h2>
      
      <div className="section">
        <h3>Pending Check-ins</h3>
        {bookings.length === 0 ? (
          <p>No pending check-ins</p>
        ) : (
          <table border="1">
            <thead>
              <tr><th>Name</th><th>Room No</th><th>Room Type</th><th>Days</th><th>Check-in Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td>{b.name}</td>
                  <td>{b.roomNo}</td>
                  <td>{b.roomType}</td>
                  <td>{b.days}</td>
                  <td>{b.checkInDate || "Today"}</td>
                  <td><button onClick={() => checkIn(b._id, b.roomNo, b.name)}>Check In</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="section">
        <h3>Active Check-ins</h3>
        {checkedIn.length === 0 ? (
          <p>No active check-ins</p>
        ) : (
          <table border="1">
            <thead>
              <tr><th>Name</th><th>Room No</th><th>Room Type</th><th>Days</th><th>Action</th></tr>
            </thead>
            <tbody>
              {checkedIn.map(b => (
                <tr key={b._id}>
                  <td>{b.name}</td>
                  <td>{b.roomNo}</td>
                  <td>{b.roomType}</td>
                  <td>{b.days}</td>
                  <td><button onClick={() => checkOut(b._id, b.roomNo, b.name)}>Check Out</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <button onClick={() => navigate("/receptionist")} className="back-btn">Back to Dashboard</button>
    </div>
  );
}