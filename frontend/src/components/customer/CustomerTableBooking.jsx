import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

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
      const response = await axios.get(`${API_URL}/api/table/${bookingId}`);
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
      const response = await axios.post(`${API_URL}/api/table`, {
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
      const response = await axios.post(`${API_URL}/api/table/add-order/${bookingId}`, {
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

  if (step === 1) {
    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>🍽️ Book a Table</h2>
        {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>{message.text}</div>}
        <input placeholder="Full Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <input placeholder="Persons *" type="number" value={form.persons} onChange={e => setForm({...form, persons: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <select value={form.tableNumber} onChange={e => setForm({...form, tableNumber: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }}>
          <option value="">Select Table *</option>
          {availableTables.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input placeholder="Time * (e.g., 7:00 PM)" value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <textarea placeholder="Special Requests" value={form.specialRequests} onChange={e => setForm({...form, specialRequests: e.target.value})} rows="3" style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "2px solid var(--border-color)" }} />
        <button onClick={bookTable} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #dc3c3c, #b83232)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px" }}>{loading ? "Booking..." : "Book Table"}</button>
        <button onClick={() => navigate("/")} style={{ width: "100%", padding: "12px", marginTop: "10px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>🍽️ Add Orders</h2>
      {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : message.type === "warning" ? "#fff3cd" : "#f8d7da", color: message.type === "success" ? "#155724" : message.type === "warning" ? "#856404" : "#721c24" }}>{message.text}</div>}
      
      <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <p><strong>Table:</strong> {bookingDetails?.tableNumber} | <strong>Guest:</strong> {bookingDetails?.name}</p>
        <p><strong>Date:</strong> {bookingDetails?.date} | <strong>Time:</strong> {bookingDetails?.time}</p>
        <p><strong>Status:</strong> {bookingStatus === "occupied" ? "✅ Confirmed" : "⏳ Pending"}</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "20px" }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setSelectedItem(item)} style={{ background: selectedItem?.id === item.id ? "#28a745" : "#ff9800", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>
            {item.emoji} {item.name}<br/>₹{item.price}
          </button>
        ))}
      </div>
      
      {selectedItem && (
        <div style={{ border: "2px solid #ff9800", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
          <h4>{selectedItem.emoji} {selectedItem.name}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: "8px 12px", background: "#ddd", border: "none", borderRadius: "5px", cursor: "pointer" }}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ padding: "8px 12px", background: "#ddd", border: "none", borderRadius: "5px", cursor: "pointer" }}>+</button>
            <button onClick={addOrder} style={{ marginLeft: "auto", padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add</button>
          </div>
        </div>
      )}
      
      <div style={{ border: "2px solid #ddd", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <h4>Your Orders</h4>
        {orders.map((o, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span>{o.emoji} {o.name} x {o.quantity}</span>
            <span>₹{o.total} <button onClick={() => removeOrder(i)} style={{ marginLeft: "10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "2px 8px" }}>✕</button></span>
          </div>
        ))}
        <hr />
        <p><strong>Food Total:</strong> ₹{totalOrderAmount}</p>
        <p><strong>Table Advance:</strong> ₹500</p>
        <p><strong>Grand Total:</strong> ₹{grandTotal}</p>
      </div>
      
      {bookingStatus === "occupied" ? (
        <button onClick={goToPayment} style={{ width: "100%", padding: "14px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Proceed to Payment → ₹{grandTotal}</button>
      ) : (
        <button disabled style={{ width: "100%", padding: "14px", background: "#ccc", color: "#666", border: "none", borderRadius: "8px", cursor: "not-allowed" }}>⏳ Waiting for Confirmation...</button>
      )}
      
      <button onClick={() => setStep(1)} style={{ width: "100%", padding: "12px", marginTop: "10px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>← Back</button>
    </div>
  );
}
