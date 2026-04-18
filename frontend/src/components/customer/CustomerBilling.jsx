import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function CustomerBilling() {
  const [roomNo, setRoomNo] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [message, setMessage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const fetchBill = async () => {
    if (!roomNo) {
      setMessage({ type: "error", text: "Please enter your room number" });
      return;
    }
    
    setLoading(true);
    try {
      const [billsRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/api/billing/room/${roomNo}`),
        axios.get(`${API_URL}/api/booking`)
      ]);
      
      const booking = bookingsRes.data.find(b => b.roomNo === roomNo && b.status === "CheckedIn");
      
      if (!booking) {
        setMessage({ type: "error", text: "No active booking found for this room" });
        setLoading(false);
        return;
      }
      
      const roomRate = booking.roomType === "Suite" ? 5000 : booking.roomType === "Deluxe" ? 3000 : 1500;
      const roomCharge = roomRate * booking.days;
      const foodTotal = billsRes.data.reduce((sum, b) => sum + (b.foodCharge || 0), 0);
      const tax = (roomCharge + foodTotal) * 0.18;
      const total = roomCharge + foodTotal + tax;
      
      setBillDetails({
        guestName: booking.name,
        roomNo: booking.roomNo,
        roomType: booking.roomType,
        days: booking.days,
        roomCharge,
        foodTotal,
        tax,
        total,
        bills: billsRes.data
      });
    } catch (error) {
      setMessage({ type: "error", text: "Error fetching bill details" });
    }
    setLoading(false);
  };

  const processPayment = async () => {
    const transactionId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setLoading(true);
    try {
      // Process payment for each unpaid bill
      for (const bill of billDetails.bills) {
        await axios.post(`${API_URL}/api/billing/pay/${bill._id}`, {
          paymentMethod,
          transactionId,
          amount: bill.total
        });
      }
      
      setMessage({ type: "success", text: `✅ Payment successful! Transaction ID: ${transactionId}` });
      setShowPaymentModal(false);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Payment failed. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>💰 View Bill & Make Payment</h2>
      
      {message && (
        <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>
          {message.text}
        </div>
      )}
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          placeholder="Enter your Room Number" 
          value={roomNo}
          onChange={e => setRoomNo(e.target.value)}
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "2px solid var(--border-color)" }}
        />
        <button onClick={fetchBill} disabled={loading} style={{ padding: "12px 20px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          {loading ? "Loading..." : "View Bill"}
        </button>
      </div>
      
      {billDetails && (
        <div style={{ border: "2px solid var(--border-color)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ color: "#dc3c3c", marginBottom: "15px" }}>Bill Details</h3>
          <div><strong>Guest Name:</strong> {billDetails.guestName}</div>
          <div><strong>Room Number:</strong> {billDetails.roomNo}</div>
          <div><strong>Room Type:</strong> {billDetails.roomType}</div>
          <div><strong>Days:</strong> {billDetails.days}</div>
          <hr style={{ margin: "10px 0" }} />
          <div><strong>Room Charges:</strong> ₹{billDetails.roomCharge.toLocaleString()}</div>
          <div><strong>Food Charges:</strong> ₹{billDetails.foodTotal.toLocaleString()}</div>
          <div><strong>Tax (18%):</strong> ₹{billDetails.tax.toLocaleString()}</div>
          <hr style={{ margin: "10px 0" }} />
          <h3 style={{ color: "#28a745" }}>Total Amount: ₹{billDetails.total.toLocaleString()}</h3>
          
          <button onClick={() => setShowPaymentModal(true)} style={{ width: "100%", marginTop: "20px", padding: "12px", background: "#4caf50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Pay Now
          </button>
        </div>
      )}
      
      {showPaymentModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "20px", maxWidth: "400px", width: "90%" }}>
            <h3 style={{ color: "#dc3c3c", textAlign: "center" }}>Confirm Payment</h3>
            <p><strong>Amount:</strong> ₹{billDetails.total.toLocaleString()}</p>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: "100%", padding: "10px", margin: "15px 0", borderRadius: "8px", border: "1px solid #ddd" }}
            >
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Card</option>
              <option value="upi">📱 UPI</option>
            </select>
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={processPayment} style={{ flex: 1, padding: "12px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Confirm</button>
              <button onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      <button onClick={() => navigate("/")} style={{ width: "100%", marginTop: "20px", padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        Back to Home
      </button>
    </div>
  );
}
