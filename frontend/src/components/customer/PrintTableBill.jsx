import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function PrintTableBill() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const printRef = useRef(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
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
      setBookings(userBookings);
      if (userBookings.length === 0) setMessage({ type: "error", text: "No bookings found" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch bookings" });
    }
    setLoading(false);
  };

  const generateBill = async (bookingId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/billing/generate-table/${bookingId}`);
      if (response.data.success) {
        if (response.data.bill.paymentStatus !== "paid") {
          setMessage({ type: "warning", text: "⚠️ This bill is not paid yet. Please complete payment first." });
          setSelectedBill(null);
        } else {
          setSelectedBill(response.data.bill);
          setMessage({ type: "success", text: "Bill loaded successfully! You can now print." });
          setTimeout(() => setMessage(null), 3000);
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to generate bill" });
    }
    setLoading(false);
  };

  const printBill = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Table Booking Bill</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f0f0; padding: 40px; }
          .invoice-container { max-width: 700px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); overflow: hidden; }
          .invoice-header { background: linear-gradient(135deg, #dc3c3c 0%, #b83232 100%); color: white; padding: 30px; text-align: center; }
          .invoice-header h1 { font-size: 2rem; margin-bottom: 5px; }
          .invoice-title { font-size: 1.1rem; margin-top: 10px; letter-spacing: 2px; }
          .hotel-info { text-align: center; padding: 20px; background: #f8f9fa; border-bottom: 1px solid #e0e0e0; }
          .booking-details { padding: 25px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #e0e0e0; }
          .detail-row strong { color: #dc3c3c; }
          .total-section { background: #f8f9fa; padding: 20px; margin: 20px; border-radius: 10px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
          .grand-total { font-size: 1.3rem; font-weight: bold; color: #dc3c3c; border-top: 2px solid #dc3c3c; margin-top: 10px; padding-top: 10px; }
          .payment-status { margin: 20px; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
          .footer { text-align: center; padding: 20px; background: #f8f9fa; font-size: 11px; color: #666; }
          @media print { body { padding: 0; margin: 0; background: white; } }
        </style>
      </head>
      <body>${printContent}<script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }</script></body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadBill = () => {
    const billHTML = printRef.current.innerHTML;
    const blob = new Blob([billHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Table_Bill_${selectedBill?._id?.slice(-6)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Bill downloaded successfully!");
  };

  const styles = {
    container: { maxWidth: "800px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px" },
    title: { textAlign: "center", color: "#dc3c3c", marginBottom: "20px", fontSize: "28px" },
    inputGroup: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
    input: { flex: 1, padding: "12px", borderRadius: "8px", border: "2px solid var(--border-color)", minWidth: "200px", background: "var(--bg-glass)", color: "var(--text-primary)" },
    button: { padding: "12px 20px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
    bookingCard: { border: "2px solid var(--border-color)", borderRadius: "12px", padding: "20px", marginBottom: "15px", background: "var(--bg-glass)" },
    printButton: { padding: "12px 24px", background: "#4caf50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginRight: "10px" },
    downloadButton: { padding: "12px 24px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
    messageSuccess: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
    messageError: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
    messageWarning: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" },
    backButton: { marginTop: "20px", padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍽️ Print Table Bill (Table + Food Orders)</h2>
      
      {message && (
        <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : message.type === "warning" ? "#fff3cd" : "#f8d7da", color: message.type === "success" ? "#155724" : message.type === "warning" ? "#856404" : "#721c24" }}>
          {message.text}
        </div>
      )}
      
      <div style={styles.inputGroup}>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        <span style={{ alignSelf: "center" }}>OR</span>
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />
        <button onClick={fetchBookings} disabled={loading} style={styles.button}>{loading ? "Searching..." : "Find Bookings"}</button>
      </div>
      
      {bookings.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "15px" }}>Your Bookings</h3>
          {bookings.map((booking) => (
            <div key={booking._id} style={styles.bookingCard}>
              <p><strong>Table Number:</strong> {booking.tableNumber}</p>
              <p><strong>Name:</strong> {booking.name}</p>
              <p><strong>Date:</strong> {booking.date || "Today"} | <strong>Time:</strong> {booking.time}</p>
              <p><strong>Persons:</strong> {booking.persons}</p>
              <p><strong>Status:</strong> {booking.paymentStatus === "paid" ? "✅ Paid" : "⏳ Unpaid"}</p>
              <button onClick={() => generateBill(booking._id)} style={{ marginTop: "15px", padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Generate Bill</button>
            </div>
          ))}
        </div>
      )}
      
      {selectedBill && selectedBill.paymentStatus === "paid" && (
        <>
          <div ref={printRef}>
            <div className="invoice-container">
              <div className="invoice-header"><h1>🏨 GRAND HOTEL</h1><p>Table Booking Invoice</p><div className="invoice-title">PAID RECEIPT</div></div>
              <div className="hotel-info"><p>123 Luxury Avenue, Downtown City</p><p>📞 +91 1234567890 | ✉️ reservations@grandhotel.com</p></div>
              <div className="booking-details">
                <div className="detail-row"><strong>Booking ID:</strong><span>#{selectedBill.tableBookings?.[0]?.id?.slice(-6)}</span></div>
                <div className="detail-row"><strong>Table Number:</strong><span>{selectedBill.tableBookings?.[0]?.tableNumber}</span></div>
                <div className="detail-row"><strong>Guest Name:</strong><span>{selectedBill.guestName}</span></div>
                <div className="detail-row"><strong>Email:</strong><span>{selectedBill.guestEmail}</span></div>
                <div className="detail-row"><strong>Phone:</strong><span>{selectedBill.guestPhone}</span></div>
                <div className="detail-row"><strong>Date:</strong><span>{selectedBill.tableBookings?.[0]?.date || new Date().toLocaleDateString()}</span></div>
                <div className="detail-row"><strong>Time:</strong><span>{selectedBill.tableBookings?.[0]?.time}</span></div>
                <div className="detail-row"><strong>Persons:</strong><span>{selectedBill.tableBookings?.[0]?.persons}</span></div>
                <div className="detail-row"><strong>Food Orders:</strong><span>{selectedBill.tableBookings?.[0]?.orders?.map(o => `${o.itemName} x ${o.quantity}`).join(", ") || "None"}</span></div>
              </div>
              <div className="total-section">
                <div className="total-row"><span>Table Advance:</span><span>₹500</span></div>
                <div className="total-row"><span>Food Total:</span><span>₹{(selectedBill.tableCharge - 500).toLocaleString()}</span></div>
                <div className="total-row"><span>GST (18%):</span><span>₹{selectedBill.tax?.toLocaleString()}</span></div>
                <div className="total-row grand-total"><span>Total Paid:</span><span>₹{selectedBill.total?.toLocaleString()}</span></div>
                <div className="total-row"><span>Transaction ID:</span><span>{selectedBill.transactionId || "N/A"}</span></div>
              </div>
              <div className="payment-status">✅ Payment Status: PAID</div>
              <div className="footer"><p>Thank you for dining with us!</p><p>★★★★★</p></div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '15px' }}>
            <button onClick={printBill} style={styles.printButton}>🖨️ Print Bill</button>
            <button onClick={downloadBill} style={styles.downloadButton}>💾 Download Bill</button>
          </div>
        </>
      )}
      
      <button onClick={() => navigate("/")} style={styles.backButton}>← Back to Home</button>
    </div>
  );
}