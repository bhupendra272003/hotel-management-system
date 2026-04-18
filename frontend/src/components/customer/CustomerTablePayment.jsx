import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../../api/config";

export default function TablePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking || null;
  const orders = location.state?.orders || [];
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!email && !phone) {
      setMessage({ type: "error", text: "Please enter email or phone number" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/table`);
      let userBookings = res.data;
      if (email) userBookings = userBookings.filter(b => b.email === email);
      if (phone) userBookings = userBookings.filter(b => b.phone === phone);
      setBookings(userBookings.filter(b => b.paymentStatus !== "paid"));
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch bookings" });
    }
    setLoading(false);
  }, [email, phone]);

  useEffect(() => {
    if (!booking) fetchBookings();
  }, [booking, fetchBookings]);

  const openPaymentModal = (b) => { setSelectedBooking(b); setShowPaymentModal(true); };

  const processPayment = async () => {
    if (!selectedBooking) return;
    const transactionId = `TBLPAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setPaying(true);
    try {
      const response = await axios.post(`${API_URL}/billing/pay-table/${selectedBooking._id}`, {
        paymentMethod, transactionId, amount: selectedBooking.advanceAmount + (selectedBooking.totalOrderAmount || 0)
      });
      if (response.data.success) {
        setPaymentCompleted(true);
        setShowPaymentModal(false);
        setMessage({ type: "success", text: `✅ Payment successful! Transaction ID: ${transactionId}` });
        if (!booking) setBookings(bookings.filter(b => b._id !== selectedBooking._id));
        setTimeout(() => navigate("/customer/print-table-bill"), 2000);
      } else {
        setMessage({ type: "error", text: "Payment failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Payment failed" });
    }
    setPaying(false);
  };

  const totalOrderAmount = orders.reduce((s, o) => s + (o.quantity * o.price), 0);
  const grandTotal = 500 + totalOrderAmount;

  const styles = {
    container: { maxWidth: "700px", margin: "40px auto", padding: "35px", background: "var(--bg-card)", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
    title: { textAlign: "center", color: "#dc3c3c", marginBottom: "10px", fontSize: "28px", fontWeight: "700" },
    subtitle: { textAlign: "center", color: "#666", marginBottom: "30px", fontSize: "14px" },
    input: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid var(--border-color)", fontSize: "15px", background: "var(--bg-glass)", color: "var(--text-primary)" },
    button: { padding: "12px 24px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
    payButton: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "600", marginTop: "10px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)" },
    modalContent: { background: "var(--bg-card)", padding: "30px", borderRadius: "20px", maxWidth: "450px", width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" },
    select: { width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid var(--border-color)", fontSize: "15px", marginBottom: "15px", background: "var(--bg-glass)", color: "var(--text-primary)", cursor: "pointer" },
    bookingCard: { border: "1px solid var(--border-color)", borderRadius: "16px", padding: "20px", marginBottom: "15px", background: "var(--bg-glass)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    backButton: { width: "100%", padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginTop: "10px" },
    successContainer: { textAlign: "center", padding: "30px", background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)", borderRadius: "16px", marginBottom: "20px" },
    messageSuccess: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
    messageError: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
    messageInfo: { backgroundColor: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb" }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍽️ Pay Table Bill (Table + Food Orders)</h2>
      <p style={styles.subtitle}>Secure payment for your table booking and food orders</p>
      
      {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", ...(message.type === "success" ? styles.messageSuccess : message.type === "info" ? styles.messageInfo : styles.messageError) }}>{message.text}</div>}
      
      {paymentCompleted && (
        <div style={styles.successContainer}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>✅</div>
          <h3 style={{ color: "#155724", marginBottom: "10px" }}>Payment Completed Successfully!</h3>
          <button onClick={() => navigate("/customer/print-table-bill")} style={{ padding: "10px 20px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "10px" }}>🖨️ Print Receipt</button>
        </div>
      )}
      
      {!paymentCompleted && (
        <>
          {booking ? (
            <div style={styles.bookingCard}>
              <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>📋 Booking Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                <p><strong>Table:</strong> {booking.tableNumber}</p><p><strong>Guest:</strong> {booking.name}</p>
                <p><strong>Date:</strong> {booking.date}</p><p><strong>Time:</strong> {booking.time}</p><p><strong>Persons:</strong> {booking.persons}</p>
              </div>
              <hr style={{ margin: "15px 0", borderColor: "var(--border-color)" }} />
              <p><strong>Table Advance:</strong> ₹500</p>
              {orders.length > 0 && (<><p><strong>Food Orders:</strong></p>{orders.map((order, idx) => (<div key={idx} style={{ marginLeft: "15px", fontSize: "14px", color: "var(--text-secondary)" }}>• {order.name} x {order.quantity} = ₹{order.quantity * order.price}</div>))}<p><strong>Food Total:</strong> ₹{totalOrderAmount}</p></>)}
              <hr style={{ margin: "15px 0", borderColor: "var(--border-color)" }} />
              <p style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745", textAlign: "center", marginTop: "10px" }}>Total to Pay: ₹{grandTotal}</p>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={styles.select}>
                <option value="cash">💵 Cash</option><option value="card">💳 Credit/Debit Card</option><option value="upi">📱 UPI</option>
              </select>
              <button onClick={() => openPaymentModal(booking)} disabled={paying} style={{ ...styles.payButton, opacity: paying ? 0.7 : 1 }}>{paying ? "Processing..." : `Pay ₹${grandTotal}`}</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                <span style={{ alignSelf: "center", color: "#999" }}>OR</span>
                <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />
                <button onClick={fetchBookings} disabled={loading} style={styles.button}>{loading ? "Searching..." : "Find Bookings"}</button>
              </div>
              {bookings.map((b) => {
                const total = b.advanceAmount + (b.totalOrderAmount || 0);
                return (<div key={b._id} style={styles.bookingCard}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <p><strong>Table:</strong> {b.tableNumber}</p><p><strong>Guest:</strong> {b.name}</p>
                    <p><strong>Date:</strong> {b.date}</p><p><strong>Time:</strong> {b.time}</p><p><strong>Persons:</strong> {b.persons}</p>
                  </div>
                  <p><strong>Amount to Pay:</strong> ₹{total}</p>
                  <p><strong>Status:</strong> {b.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}</p>
                  {b.paymentStatus !== "paid" && (<><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ ...styles.select, marginTop: "10px" }}><option value="cash">💵 Cash</option><option value="card">💳 Card</option><option value="upi">📱 UPI</option></select>
                  <button onClick={() => openPaymentModal(b)} disabled={paying} style={{ ...styles.payButton, opacity: paying ? 0.7 : 1 }}>{paying ? "Processing..." : `Pay ₹${total}`}</button></>)}
                </div>);
              })}
            </>
          )}
        </>
      )}
      
      <button onClick={() => navigate("/")} style={styles.backButton}>← Back to Home</button>
      
      {showPaymentModal && selectedBooking && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}><div style={{ fontSize: "48px" }}>💳</div><h3 style={{ color: "#2c3e50", marginTop: "10px" }}>Confirm Payment</h3></div>
            <div style={{ background: "var(--bg-glass)", padding: "15px", borderRadius: "12px", marginBottom: "20px" }}>
              <p><strong>Table:</strong> {selectedBooking.tableNumber}</p><p><strong>Guest:</strong> {selectedBooking.name}</p>
              <p><strong>Amount:</strong> ₹{selectedBooking.advanceAmount + (selectedBooking.totalOrderAmount || 0)}</p><p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={processPayment} disabled={paying} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", color: "white", border: "none", borderRadius: "10px", cursor: paying ? "not-allowed" : "pointer", opacity: paying ? 0.7 : 1, fontWeight: "600" }}>{paying ? "Processing..." : "Confirm Payment"}</button>
              <button onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}