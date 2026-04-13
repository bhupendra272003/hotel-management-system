import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ManageTables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/table");
      setTables(res.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch tables" });
    } finally {
      setLoading(false);
    }
  };

  const viewOrders = async (tableId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/table/orders/${tableId}`);
      setOrders(res.data.orders);
      setSelectedTable(tableId);
    } catch (error) {
      alert("Failed to fetch orders");
    }
  };

  const updateOrderStatus = async (tableId, orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/table/update-order/${tableId}/${orderId}`, { status });
      viewOrders(tableId);
      setMessage({ type: "success", text: `Order marked as ${status}` });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      alert("Failed to update order");
    }
  };

  const updateTableStatus = async (id, newStatus) => {
    try {
      if (newStatus === "occupied") await axios.put(`http://localhost:5000/api/table/occupy/${id}`);
      else if (newStatus === "available") await axios.put(`http://localhost:5000/api/table/free/${id}`);
      fetchTables();
      setMessage({ type: "success", text: `Table marked as ${newStatus}` });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Delete this booking?")) {
      await axios.delete(`http://localhost:5000/api/table/${id}`);
      fetchTables();
    }
  };

  const styles = {
    container: { maxWidth: "1200px", margin: "40px auto", padding: "20px" },
    title: { textAlign: "center", color: "#dc3c3c", marginBottom: "20px", fontSize: "28px" },
    table: { width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
    th: { background: "#dc3c3c", color: "white", padding: "15px", textAlign: "left" },
    td: { padding: "12px", borderBottom: "1px solid #ddd" },
    statusBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", display: "inline-block" },
    btnArrived: { marginRight: "5px", background: "#ff9800", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
    btnFree: { background: "#4caf50", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
    btnView: { background: "#2196f3", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", marginRight: "5px" },
    btnDelete: { background: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { background: "white", padding: "30px", borderRadius: "15px", maxWidth: "500px", width: "90%", maxHeight: "80vh", overflow: "auto" },
    orderStatusBadge: { padding: "2px 8px", borderRadius: "12px", fontSize: "11px", marginLeft: "5px", display: "inline-block" },
    refreshBtn: { padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginRight: "10px" },
    backBtn: { padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading tables...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍽️ Manage Tables</h2>
      {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>{message.text}</div>}
      
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead><tr>{["Table", "Customer", "Phone", "Persons", "Time", "Orders", "Status", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {tables.map((table, i) => (
              <tr key={table._id} style={{ borderBottom: "1px solid #ddd", background: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                <td style={styles.td}>{table.tableNumber}</td>
                <td style={styles.td}>{table.name || "—"}</td>
                <td style={styles.td}>{table.phone || "—"}</td>
                <td style={styles.td}>{table.persons || "—"}</td>
                <td style={styles.td}>{table.time || "—"}</td>
                <td style={styles.td}><button onClick={() => viewOrders(table._id)} style={styles.btnView}>View ({table.orders?.length || 0})</button></td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, background: table.bookingStatus === "occupied" ? "#ff9800" : table.bookingStatus === "booked" ? "#2196f3" : "#4caf50", color: "white" }}>{table.bookingStatus}</span>
                </td>
                <td style={styles.td}>
                  {table.bookingStatus === "booked" && <button onClick={() => updateTableStatus(table._id, "occupied")} style={styles.btnArrived}>Arrived</button>}
                  {table.bookingStatus === "occupied" && <button onClick={() => updateTableStatus(table._id, "available")} style={styles.btnFree}>Free Table</button>}
                  {(table.bookingStatus === "booked" || table.bookingStatus === "occupied") && <button onClick={() => deleteBooking(table._id)} style={styles.btnDelete}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={fetchTables} style={styles.refreshBtn}>🔄 Refresh</button>
        <button onClick={() => navigate("/receptionist")} style={styles.backBtn}>← Back</button>
      </div>
      
      {selectedTable && (
        <div style={styles.modalOverlay} onClick={() => setSelectedTable(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#dc3c3c", marginBottom: "15px" }}>Table Orders</h3>
            {orders.length === 0 ? <p>No orders yet</p> : orders.map((order, idx) => (
              <div key={idx} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "8px" }}>
                <p><strong>{order.itemName}</strong> x {order.quantity} = ₹{order.total}</p>
                <p>Status: <span style={{ ...styles.orderStatusBadge, background: order.status === "served" ? "#d4edda" : order.status === "preparing" ? "#fff3cd" : "#f8d7da", color: order.status === "served" ? "#155724" : order.status === "preparing" ? "#856404" : "#721c24" }}>{order.status}</span></p>
                <div>
                  {order.status === "pending" && <button onClick={() => updateOrderStatus(selectedTable, order._id, "preparing")} style={{ marginRight: "5px", background: "#ff9800", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Start Preparing</button>}
                  {order.status === "preparing" && <button onClick={() => updateOrderStatus(selectedTable, order._id, "served")} style={{ background: "#4caf50", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Mark Served</button>}
                </div>
              </div>
            ))}
            <button onClick={() => setSelectedTable(null)} style={{ marginTop: "20px", width: "100%", padding: "10px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}