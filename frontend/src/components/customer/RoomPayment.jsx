import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function RoomPayment() {
  const [roomNo, setRoomNo] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  const fetchBill = async () => {
    if (!roomNo) {
      setMessage({ type: "error", text: "Please enter room number" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    setPaymentCompleted(false);
    
    try {
      const response = await axios.post(`${API_URL}/billing/generate-combined/${roomNo}`);
      
      if (response.data.success) {
        const billData = response.data.bill;
        setBill(billData);
        
        if (billData.paymentStatus === "paid") {
          setPaymentCompleted(true);
          setMessage({ type: "success", text: "✅ This bill is already paid!" });
        }
      } else {
        setMessage({ type: "error", text: response.data.error || "No active booking found" });
        setBill(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Failed to fetch bill. Make sure backend is running." });
      setBill(null);
    }
    setLoading(false);
  };

  const processPayment = async () => {
    if (!bill) return;
    
    const transactionId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setPaying(true);
    setMessage(null);
    
    try {
      const response = await axios.post(`${API_URL}/billing/pay-room/${roomNo}`, {
        paymentMethod,
        transactionId,
        amount: bill.remainingAmount
      });
      
      if (response.data.success) {
        setPaymentCompleted(true);
        setMessage({ type: "success", text: `✅ Payment successful! Transaction ID: ${transactionId}\nAmount Paid: ₹${bill.remainingAmount?.toLocaleString()}` });
        
        setTimeout(async () => {
          const updatedResponse = await axios.post(`${API_URL}/billing/generate-combined/${roomNo}`);
          if (updatedResponse.data.success) {
            setBill(updatedResponse.data.bill);
          }
        }, 500);
      } else {
        setMessage({ type: "error", text: "Payment failed. Please try again." });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage({ type: "error", text: error.response?.data?.error || "Payment failed. Please try again." });
    }
    setPaying(false);
  };

  const styles = {
    container: { maxWidth: "600px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
    title: { textAlign: "center", color: "#dc3c3c", marginBottom: "20px", fontSize: "28px" },
    inputGroup: { display: "flex", gap: "10px", marginBottom: "20px" },
    input: { flex: 1, padding: "12px", borderRadius: "8px", border: "2px solid var(--border-color)", background: "var(--bg-glass)", color: "var(--text-primary)" },
    button: { padding: "12px 24px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
    payButton: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #4caf50, #388e3c)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginTop: "15px" },
    billCard: { border: "2px solid var(--border-color)", borderRadius: "12px", padding: "20px", marginBottom: "20px", background: "var(--bg-glass)" },
    billRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-color)" },
    totalRow: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #dc3c3c", marginTop: "10px", fontWeight: "bold", fontSize: "18px" },
    statusBadge: { display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" },
    statusPaid: { background: "#d4edda", color: "#155724" },
    statusUnpaid: { background: "#fff3cd", color: "#856404" },
    messageSuccess: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
    messageError: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
    select: { width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid var(--border-color)", fontSize: "16px", marginBottom: "10px", background: "var(--bg-glass)", color: "var(--text-primary)" },
    backButton: { width: "100%", padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "10px" },
    successContainer: { textAlign: "center", padding: "20px", background: "#d4edda", borderRadius: "12px", marginBottom: "20px" }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏠 Pay Room Bill (Room + Food)</h2>
      
      {message && (
        <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", ...(message.type === "success" ? styles.messageSuccess : styles.messageError) }}>
          {message.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}
      
      {paymentCompleted && (
        <div style={styles.successContainer}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>✅</div>
          <h3 style={{ color: "#155724" }}>Payment Completed Successfully!</h3>
          <button onClick={() => navigate("/customer/print-room-bill")} style={{ padding: "10px 20px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "10px" }}>🖨️ Print Receipt</button>
        </div>
      )}
      
      {!paymentCompleted && (
        <>
          <div style={styles.inputGroup}>
            <input type="text" placeholder="Enter Room Number (e.g., 101)" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} style={styles.input} />
            <button onClick={fetchBill} disabled={loading} style={styles.button}>{loading ? "Loading..." : "Get Bill"}</button>
          </div>
          
          {bill && bill.paymentStatus !== "paid" && (
            <div style={styles.billCard}>
              <h3 style={{ marginBottom: "15px", color: "#dc3c3c" }}>Bill Details (Room + Food)</h3>
              <div style={styles.billRow}><span><strong>Guest Name:</strong></span><span>{bill.guestName}</span></div>
              <div style={styles.billRow}><span><strong>Room:</strong></span><span>{bill.roomNo} | {bill.roomDetails?.roomType} | {bill.roomDetails?.days} days</span></div>
              <div style={styles.billRow}><span><strong>Room Charge:</strong></span><span>₹{bill.roomCharge?.toLocaleString()}</span></div>
              <div style={styles.billRow}><span><strong>Food Charge:</strong></span><span>₹{bill.foodCharge?.toLocaleString()}</span></div>
              <div style={styles.billRow}><span><strong>Tax (18%):</strong></span><span>₹{bill.tax?.toLocaleString()}</span></div>
              <div style={styles.totalRow}><span><strong>Total Amount:</strong></span><span><strong>₹{bill.total?.toLocaleString()}</strong></span></div>
              <div style={styles.billRow}><span><strong>Remaining:</strong></span><span style={{ color: "#dc3c3c" }}>₹{bill.remainingAmount?.toLocaleString()}</span></div>
              <div style={styles.billRow}><span><strong>Status:</strong></span><span><span style={{ ...styles.statusBadge, ...styles.statusUnpaid }}>⏳ UNPAID</span></span></div>
              
              <div style={{ marginTop: "20px" }}>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={styles.select}>
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Credit/Debit Card</option>
                  <option value="upi">📱 UPI (Google Pay, PhonePe)</option>
                </select>
                <button onClick={processPayment} disabled={paying} style={{ ...styles.payButton, opacity: paying ? 0.7 : 1 }}>
                  {paying ? "Processing..." : `Pay ₹${bill.remainingAmount?.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      <button onClick={() => navigate("/")} style={styles.backButton}>← Back to Home</button>
    </div>
  );
}