import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ConfirmTables() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/table");
      setBookings(res.data.filter(b => b.bookingStatus === "booked"));
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch bookings" });
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id, tableNumber, name) => {
    if (!window.confirm(`Confirm booking for ${name} at Table ${tableNumber}?`)) return;
    try {
      await axios.put(`http://localhost:5000/api/table/occupy/${id}`);
      setMessage({ type: "success", text: `✅ Table ${tableNumber} confirmed for ${name}!` });
      fetchBookings();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to confirm" });
    }
  };

  const styles = {
    container: { maxWidth: "1200px", margin: "40px auto", padding: "20px" },
    title: { textAlign: "center", color: "#dc3c3c", marginBottom: "20px", fontSize: "28px" },
    table: { width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
    th: { background: "#dc3c3c", color: "white", padding: "15px", textAlign: "left" },
    td: { padding: "12px", borderBottom: "1px solid #ddd" },
    confirmBtn: { padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    refreshBtn: { padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginRight: "10px" },
    backBtn: { padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍽️ Confirm Table Bookings</h2>
      {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>{message.text}</div>}
      
      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#f8f9fa", borderRadius: "12px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div><p>No pending table bookings</p>
          <button onClick={fetchBookings} style={styles.refreshBtn}>Refresh</button>
        </div>
      ) : (
        <>
          <table style={styles.table}>
            <thead><tr>{["Table", "Customer", "Phone", "Persons", "Time", "Action"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b._id} style={{ borderBottom: "1px solid #ddd", background: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                  <td style={styles.td}>{b.tableNumber}</td><td style={styles.td}>{b.name}</td><td style={styles.td}>{b.phone}</td>
                  <td style={styles.td}>{b.persons}</td><td style={styles.td}>{b.time}</td>
                  <td style={styles.td}><button onClick={() => confirmBooking(b._id, b.tableNumber, b.name)} style={styles.confirmBtn}>Confirm</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={fetchBookings} style={styles.refreshBtn}>🔄 Refresh</button>
            <button onClick={() => navigate("/receptionist")} style={styles.backBtn}>← Back</button>
          </div>
        </>
      )}
    </div>
  );
}