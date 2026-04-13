import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PrintTableBill() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState(null);
  const printRef = useRef(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    if (!email && !phone) {
      setMessage({ type: "error", text: "Enter email or phone" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/table");
      let userBookings = res.data;
      if (email) userBookings = userBookings.filter(b => b.email === email);
      else if (phone) userBookings = userBookings.filter(b => b.phone === phone);
      setBookings(userBookings);
      if (userBookings.length === 0) setMessage({ type: "error", text: "No bookings found" });
      else setMessage(null);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch" });
    }
    setLoading(false);
  };

  const generateBill = async (bookingId) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/billing/generate-table/${bookingId}`);
      if (res.data.success) setSelectedBill(res.data.bill);
    } catch (err) {
      setMessage({ type: "error", text: "Bill generation failed" });
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!selectedBill) return;
    const transactionId = `TBLPAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setPaying(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/billing/pay-category/${selectedBill._id}`, {
        category: "table",
        amount: selectedBill.remainingAmount,
        paymentMethod: "cash",
        transactionId,
      });
      if (res.data.success) {
        setSelectedBill(res.data.bill);
        setMessage({ type: "success", text: "Payment successful! You can now print." });
      } else {
        setMessage({ type: "error", text: "Payment failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Payment error" });
    }
    setPaying(false);
  };

  const printBill = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Table Bill</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        .invoice { max-width: 700px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 12px; }
        .header { background: #dc3c3c; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
      </style>
      </head>
      <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
    setTimeout(() => win.close(), 500);
  };

  const downloadBill = () => {
    const html = printRef.current.innerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Table_Bill_${selectedBill?._id?.slice(-6)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>🍽️ Table Booking Bill</h2>
      {message && (
        <div style={{ padding: "10px", marginBottom: "15px", borderRadius: "8px", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>
          {message.text}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        <span>OR</span>
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        <button onClick={fetchBookings} disabled={loading} style={{ padding: "10px 20px", background: "#dc3c3c", color: "white", border: "none", borderRadius: "8px" }}>Find</button>
      </div>

      {bookings.length > 0 && (
        <div>
          <h3>Your Bookings</h3>
          {bookings.map(b => (
            <div key={b._id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
              <p><strong>Table:</strong> {b.tableNumber} | <strong>Date:</strong> {b.date || "Today"} | <strong>Time:</strong> {b.time} | <strong>Persons:</strong> {b.persons}</p>
              <p><strong>Status:</strong> {b.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}</p>
              <button onClick={() => generateBill(b._id)} style={{ background: "#2196f3", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Generate Bill</button>
            </div>
          ))}
        </div>
      )}

      {selectedBill && (
        <>
          <div ref={printRef}>
            <div className="invoice">
              <div className="header"><h2>🏨 GRAND HOTEL</h2><p>Table Booking Invoice</p></div>
              <div style={{ padding: "20px" }}>
                <p><strong>Guest:</strong> {selectedBill.guestName}</p>
                <p><strong>Table:</strong> {selectedBill.tableBookings?.[0]?.tableNumber}</p>
                <p><strong>Date:</strong> {selectedBill.tableBookings?.[0]?.date || "N/A"} | <strong>Time:</strong> {selectedBill.tableBookings?.[0]?.time}</p>
                <p><strong>Persons:</strong> {selectedBill.tableBookings?.[0]?.persons}</p>
                <p><strong>Amount:</strong> ₹{selectedBill.tableCharge?.toLocaleString()}</p>
                <p><strong>Tax (18%):</strong> ₹{selectedBill.tax?.toLocaleString()}</p>
                <p><strong>Total:</strong> ₹{selectedBill.total?.toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedBill.paymentStatus === "paid" ? "✅ PAID" : "⏳ UNPAID"}</p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center", display: "flex", gap: "15px", justifyContent: "center" }}>
            {selectedBill.paymentStatus === "paid" ? (
              <>
                <button onClick={printBill} style={{ padding: "10px 20px", background: "#4caf50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>🖨️ Print</button>
                <button onClick={downloadBill} style={{ padding: "10px 20px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>💾 Download</button>
              </>
            ) : (
              <button onClick={handlePayment} disabled={paying} style={{ padding: "10px 20px", background: "#ff9800", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>{paying ? "Processing..." : `Pay ₹${selectedBill.remainingAmount} & Print`}</button>
            )}
          </div>
        </>
      )}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => navigate("/")} style={{ background: "#6c757d", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer" }}>Back to Home</button>
      </div>
    </div>
  );
}