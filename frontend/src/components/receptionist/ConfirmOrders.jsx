import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ConfirmOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food");
      setOrders(res.data.filter(o => o.status !== "delivered" && o.status !== "cancelled"));
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch orders" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, roomNo) => {
    try {
      await axios.put(`http://localhost:5000/api/food/${id}`, { status });
      setMessage({ type: "success", text: `✅ Order for Room ${roomNo} marked as ${status}!` });
      fetchOrders();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update" });
    }
  };

  const styles = {
    container: { maxWidth: "1000px", margin: "40px auto", padding: "20px" },
    title: { textAlign: "center", color: "#dc3c3c", marginBottom: "20px", fontSize: "28px" },
    card: { border: "1px solid #ddd", borderRadius: "12px", padding: "20px", marginBottom: "15px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", display: "inline-block" },
    buttonConfirm: { padding: "8px 16px", background: "#17a2b8", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "8px" },
    buttonDeliver: { padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    refreshBtn: { padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginRight: "10px" },
    backBtn: { padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading orders...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍕 Confirm Food Orders</h2>
      {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>{message.text}</div>}
      
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#f8f9fa", borderRadius: "12px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍕</div><p>No pending food orders</p>
          <button onClick={fetchOrders} style={styles.refreshBtn}>Refresh</button>
        </div>
      ) : (
        <>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, color: "#dc3c3c" }}>Order #{order._id.slice(-6)}</h3>
                <span style={{ ...styles.badge, background: order.status === "pending" ? "#ffc107" : "#17a2b8", color: "white" }}>{order.status || "pending"}</span>
              </div>
              <p><strong>Room Number:</strong> {order.roomNo || "N/A"}</p>
              <p><strong>Items:</strong></p>
              <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>{order.items?.map((item, i) => <li key={i}>{item}</li>)}</ul>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <div>
                {order.status !== "confirmed" && <button onClick={() => updateStatus(order._id, "confirmed", order.roomNo)} style={styles.buttonConfirm}>Confirm Order</button>}
                {order.status === "confirmed" && <button onClick={() => updateStatus(order._id, "delivered", order.roomNo)} style={styles.buttonDeliver}>Mark Delivered</button>}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={fetchOrders} style={styles.refreshBtn}>🔄 Refresh</button>
            <button onClick={() => navigate("/receptionist")} style={styles.backBtn}>← Back</button>
          </div>
        </>
      )}
    </div>
  );
}