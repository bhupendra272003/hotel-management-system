import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerTableBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", persons: "", tableNumber: "", time: "", date: "", specialRequests: ""
  });
  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const availableTables = ["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10"];
  const menuItems = [
    { id: 1, name: "Chicken Biryani", price: 250, emoji: "🍗" },
    { id: 2, name: "Butter Chicken", price: 350, emoji: "🍛" },
    { id: 3, name: "Dal Makhani", price: 200, emoji: "🫘" },
    { id: 4, name: "Garlic Naan", price: 40, emoji: "🥖" },
    { id: 5, name: "Ice Cream", price: 100, emoji: "🍨" },
    { id: 6, name: "Coffee", price: 80, emoji: "☕" },
    { id: 7, name: "Garden Salad", price: 120, emoji: "🥗" },
    { id: 8, name: "Veg Noodles", price: 180, emoji: "🍜" }
  ];

  const checkBookingStatus = useCallback(async () => {
    if (!bookingId) return;
    setCheckingStatus(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/table/${bookingId}`);
      if (response.data) {
        setBookingStatus(response.data.bookingStatus);
        if (response.data.bookingStatus === "occupied") {
          setMessage({ type: "success", text: "✅ Your table booking has been confirmed! You can now proceed to payment." });
          setTimeout(() => setMessage(null), 5000);
        }
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
    setCheckingStatus(false);
  }, [bookingId]);

  useEffect(() => {
    let interval;
    if (bookingId && step === 2) {
      checkBookingStatus();
      interval = setInterval(checkBookingStatus, 5000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [bookingId, step, checkBookingStatus]);

  const bookTable = async () => {
    if (!form.name) { setMessage({ type: "error", text: "Please enter your name" }); return; }
    if (!form.persons) { setMessage({ type: "error", text: "Please enter number of persons" }); return; }
    if (!form.time) { setMessage({ type: "error", text: "Please select time" }); return; }
    if (!form.tableNumber) { setMessage({ type: "error", text: "Please select table number" }); return; }
    if (!form.date) { setMessage({ type: "error", text: "Please select date" }); return; }
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/table", {
        tableNumber: form.tableNumber, name: form.name, email: form.email, phone: form.phone,
        persons: parseInt(form.persons), time: form.time, date: form.date, specialRequests: form.specialRequests
      });
      
      if (response.data.success) {
        setBookingId(response.data.table._id);
        setBookingDetails(response.data.table);
        setBookingStatus("booked");
        setStep(2);
        setMessage({ type: "success", text: `✅ Table ${form.tableNumber} booked! Waiting for confirmation...` });
      } else {
        setMessage({ type: "error", text: response.data.error || "Booking failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Booking failed. Please try again." });
    }
    setLoading(false);
  };

  const addOrder = async () => {
    if (!selectedItem) { setMessage({ type: "error", text: "Please select an item" }); return; }
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/table/add-order/${bookingId}`, {
        itemName: selectedItem.name, quantity, price: selectedItem.price
      });
      if (response.data.success) {
        setOrders([...orders, { ...selectedItem, quantity, total: quantity * selectedItem.price }]);
        setSelectedItem(null);
        setQuantity(1);
        setMessage({ type: "success", text: "🍽️ Order added!" });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add order" });
    }
    setLoading(false);
  };

  const removeOrder = (index) => setOrders(orders.filter((_, i) => i !== index));
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = [...orders];
    updated[index].quantity = newQuantity;
    updated[index].total = newQuantity * updated[index].price;
    setOrders(updated);
  };

  const goToPayment = () => {
    if (bookingStatus !== "occupied") {
      setMessage({ type: "warning", text: "⚠️ Please wait for receptionist confirmation before payment." });
      return;
    }
    navigate("/customer/table-payment", { state: { booking: bookingDetails, orders } });
  };

  const totalOrderAmount = orders.reduce((s, o) => s + o.total, 0);
  const grandTotal = 500 + totalOrderAmount;

  const styles = {
    container: {
      maxWidth: "650px", margin: "40px auto", padding: "35px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },
    title: { textAlign: "center", color: "#1a1a2e", marginBottom: "8px", fontSize: "28px", fontWeight: "700" },
    subtitle: { textAlign: "center", color: "#666", marginBottom: "32px", fontSize: "14px" },
    input: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #e8e8e8", fontSize: "15px", transition: "all 0.2s ease", outline: "none" },
    select: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #e8e8e8", fontSize: "15px", background: "white", cursor: "pointer" },
    textarea: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #e8e8e8", fontSize: "15px", resize: "vertical" },
    button: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)", color: "white", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "24px", transition: "all 0.3s ease" },
    buttonSecondary: { width: "100%", padding: "14px", background: "transparent", color: "#666", border: "2px solid #e8e8e8", borderRadius: "12px", fontSize: "15px", fontWeight: "500", cursor: "pointer", marginTop: "12px" },
    buttonSuccess: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)", color: "white", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "16px" },
    buttonDisabled: { width: "100%", padding: "16px", background: "#ccc", color: "#666", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "not-allowed", marginTop: "16px" },
    messageSuccess: { padding: "14px", borderRadius: "12px", marginBottom: "24px", textAlign: "center", backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
    messageError: { padding: "14px", borderRadius: "12px", marginBottom: "24px", textAlign: "center", backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
    messageWarning: { padding: "14px", borderRadius: "12px", marginBottom: "24px", textAlign: "center", backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" },
    summaryBox: { background: "linear-gradient(135deg, #f8f9fa 0%, #fff 100%)", padding: "20px", borderRadius: "16px", marginBottom: "24px", border: "1px solid #e8e8e8" },
    menuGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" },
    menuButton: { background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)", color: "white", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontSize: "13px", fontWeight: "500" },
    selectedMenuButton: { background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)", color: "white", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontSize: "13px", fontWeight: "500" },
    selectedItemBox: { border: "2px solid #ff9800", padding: "20px", borderRadius: "16px", marginBottom: "24px", background: "#fff8f0" },
    orderCard: { border: "2px solid #e8e8e8", padding: "20px", borderRadius: "16px", marginBottom: "24px", background: "#fafafa" },
    statusBadge: { display: "inline-block", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
    statusPending: { background: "#ffc107", color: "#333" },
    statusConfirmed: { background: "#28a745", color: "white" },
    row: { display: "flex", gap: "16px", marginBottom: "16px" },
    halfInput: { flex: 1 }
  };

  if (step === 1) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🍽️ Reserve a Table</h2>
        <p style={styles.subtitle}>Book your table and order food in advance</p>
        {message && <div style={message.type === "success" ? styles.messageSuccess : styles.messageError}>{message.text}</div>}
        
        <div style={styles.row}>
          <div style={styles.halfInput}>
            <input placeholder="Full Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={styles.input} />
          </div>
          <div style={styles.halfInput}>
            <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={styles.input} />
          </div>
        </div>
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={styles.input} />
        
        <div style={styles.row}>
          <div style={styles.halfInput}>
            <input placeholder="Number of Persons *" type="number" value={form.persons} onChange={e => setForm({...form, persons: e.target.value})} style={styles.input} />
          </div>
          <div style={styles.halfInput}>
            <select value={form.tableNumber} onChange={e => setForm({...form, tableNumber: e.target.value})} style={styles.select}>
              <option value="">Select Table *</option>
              {availableTables.map(table => <option key={table} value={table}>{table}</option>)}
            </select>
          </div>
        </div>
        
        <div style={styles.row}>
          <div style={styles.halfInput}>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={styles.input} />
          </div>
          <div style={styles.halfInput}>
            <input placeholder="Time * (e.g., 7:00 PM)" value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={styles.input} />
          </div>
        </div>
        <textarea placeholder="Special Requests" value={form.specialRequests} onChange={e => setForm({...form, specialRequests: e.target.value})} rows="3" style={styles.textarea} />
        
        <button onClick={bookTable} disabled={loading} style={{...styles.button, opacity: loading ? 0.7 : 1}}>
          {loading ? "Booking..." : "Book Table & Continue →"}
        </button>
        <button onClick={() => navigate("/")} style={styles.buttonSecondary}>← Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{...styles.container, maxWidth: "750px"}}>
      <h2 style={styles.title}>🍽️ Place Your Order</h2>
      <p style={styles.subtitle}>Add delicious items to your order</p>
      {message && <div style={message.type === "success" ? styles.messageSuccess : message.type === "warning" ? styles.messageWarning : styles.messageError}>{message.text}</div>}
      
      <div style={styles.summaryBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div><span style={{ fontSize: "14px", color: "#666" }}>Table</span><div style={{ fontSize: "20px", fontWeight: "bold", color: "#e74c3c" }}>{bookingDetails?.tableNumber}</div></div>
          <div><span style={{ fontSize: "14px", color: "#666" }}>Guest</span><div style={{ fontSize: "16px", fontWeight: "500" }}>{bookingDetails?.name}</div></div>
          <div><span style={{ fontSize: "14px", color: "#666" }}>Date & Time</span><div>{bookingDetails?.date} | {bookingDetails?.time}</div></div>
          <div>
            <span style={{ fontSize: "14px", color: "#666" }}>Status</span>
            <div><span style={{ ...styles.statusBadge, ...(bookingStatus === "occupied" ? styles.statusConfirmed : styles.statusPending) }}>{bookingStatus === "occupied" ? "✅ Confirmed" : "⏳ Pending"}</span></div>
          </div>
        </div>
      </div>
      
      <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>📋 Our Menu</h3>
      <div style={styles.menuGrid}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setSelectedItem(item)} style={selectedItem?.id === item.id ? styles.selectedMenuButton : styles.menuButton}>
            <span style={{ fontSize: "20px", display: "block", marginBottom: "4px" }}>{item.emoji}</span>
            {item.name}<br/><span style={{ fontSize: "12px", opacity: 0.9 }}>₹{item.price}</span>
          </button>
        ))}
      </div>
      
      {selectedItem && (
        <div style={styles.selectedItemBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h4>{selectedItem.emoji} {selectedItem.name}</h4>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#e74c3c" }}>₹{selectedItem.price}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "16px" }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: "8px 16px", background: "#e0e0e0", border: "none", borderRadius: "8px", cursor: "pointer" }}>−</button>
            <span style={{ fontSize: "18px", fontWeight: "bold", minWidth: "40px", textAlign: "center" }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ padding: "8px 16px", background: "#e0e0e0", border: "none", borderRadius: "8px", cursor: "pointer" }}>+</button>
            <span style={{ marginLeft: "auto" }}>Total: <strong>₹{quantity * selectedItem.price}</strong></span>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={addOrder} disabled={loading} style={{ flex: 1, padding: "12px", background: "#27ae60", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", opacity: loading ? 0.7 : 1 }}>{loading ? "Adding..." : "Add to Order"}</button>
            <button onClick={() => { setSelectedItem(null); setQuantity(1); }} style={{ flex: 1, padding: "12px", background: "#e0e0e0", color: "#333", border: "none", borderRadius: "10px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      
      <div style={styles.orderCard}>
        <h4>🛒 Your Orders</h4>
        {orders.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "30px" }}>No items added yet.</p>
        ) : (
          <>
            {orders.map((order, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #e8e8e8" }}>
                <div><strong>{order.emoji} {order.name}</strong><div style={{ fontSize: "12px", color: "#666" }}>₹{order.price} each</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => updateQuantity(idx, order.quantity - 1)} style={{ padding: "4px 10px", background: "#e0e0e0", border: "none", borderRadius: "4px", cursor: "pointer" }}>-</button>
                  <span style={{ minWidth: "35px", textAlign: "center" }}>{order.quantity}</span>
                  <button onClick={() => updateQuantity(idx, order.quantity + 1)} style={{ padding: "4px 10px", background: "#e0e0e0", border: "none", borderRadius: "4px", cursor: "pointer" }}>+</button>
                  <span style={{ minWidth: "70px", textAlign: "right", fontWeight: "bold", color: "#e74c3c" }}>₹{order.total}</span>
                  <button onClick={() => removeOrder(idx)} style={{ padding: "4px 8px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>✕</button>
                </div>
              </div>
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginTop: "15px" }}>
              <div><p><span style={{ color: "#666" }}>Food Total:</span> <strong>₹{totalOrderAmount}</strong></p><p><span style={{ color: "#666" }}>Table Advance:</span> <strong>₹500</strong></p></div>
              <p style={{ fontSize: "20px", fontWeight: "bold", color: "#e74c3c" }}>Grand Total: ₹{grandTotal}</p>
            </div>
          </>
        )}
      </div>
      
      {checkingStatus && <p style={{ textAlign: "center", fontSize: "12px", color: "#666", marginBottom: "10px" }}>Checking confirmation status...</p>}
      
      {bookingStatus === "occupied" ? (
        <button onClick={goToPayment} style={styles.buttonSuccess}>Proceed to Payment → ₹{grandTotal}</button>
      ) : (
        <button disabled style={styles.buttonDisabled}>⏳ Waiting for Receptionist Confirmation...</button>
      )}
      
      <button onClick={() => setStep(1)} style={styles.buttonSecondary}>← Back to Booking</button>
      <button onClick={() => navigate("/")} style={{ ...styles.buttonSecondary, marginTop: "8px" }}>Cancel & Go Home</button>
    </div>
  );
}