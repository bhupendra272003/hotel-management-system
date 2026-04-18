import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function PrintRoomBill() {
  const [roomNo, setRoomNo] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const printRef = useRef(null);
  const navigate = useNavigate();

  const fetchBill = async () => {
    if (!roomNo) {
      setMessage({ type: "error", text: "Please enter room number" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await axios.post(`${API_URL}/billing/generate-combined/${roomNo}`);
      
      if (response.data.success) {
        const billData = response.data.bill;
        
        if (billData.paymentStatus !== "paid" && billData.remainingAmount > 0) {
          setMessage({ type: "warning", text: `⚠️ Bill is not paid yet! Remaining amount: ₹${billData.remainingAmount?.toLocaleString()}. Please complete payment first.`, remainingAmount: billData.remainingAmount });
          setBill(null);
        } else {
          setBill(billData);
          setMessage({ type: "success", text: "✅ Bill loaded successfully! You can now print." });
          setTimeout(() => setMessage(null), 3000);
        }
      } else {
        setMessage({ type: "error", text: response.data.error || "No active booking found" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load bill. Make sure backend is running." });
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
        <title>Hotel Room Bill - Room ${bill.roomNo}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f0f0; padding: 40px; }
          .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); overflow: hidden; }
          .invoice-header { background: linear-gradient(135deg, #dc3c3c 0%, #b83232 100%); color: white; padding: 30px; text-align: center; }
          .invoice-header h1 { font-size: 2rem; margin-bottom: 5px; }
          .invoice-title { font-size: 1.2rem; margin-top: 10px; letter-spacing: 2px; }
          .hotel-info { text-align: center; padding: 20px; background: #f8f9fa; border-bottom: 1px solid #e0e0e0; }
          .guest-info { padding: 25px; background: white; border-bottom: 1px solid #e0e0e0; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px; }
          .info-item { display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px; }
          .info-item strong { color: #dc3c3c; }
          .section-title { background: #f0f0f0; padding: 10px 20px; margin: 20px 25px 10px 25px; font-size: 1.1rem; font-weight: bold; color: #dc3c3c; border-left: 4px solid #dc3c3c; }
          .charges-table { width: calc(100% - 50px); margin: 0 25px 20px 25px; border-collapse: collapse; }
          .charges-table th { background: #dc3c3c; color: white; padding: 10px; text-align: left; }
          .charges-table td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
          .total-section { background: #f8f9fa; padding: 20px 30px; margin: 20px 25px; border-radius: 10px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .grand-total { font-size: 1.3rem; font-weight: bold; color: #dc3c3c; border-top: 2px solid #dc3c3c; margin-top: 10px; padding-top: 10px; }
          .payment-status { margin: 20px 25px; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
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
    a.download = `Room_Bill_${bill.roomNo}_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Bill downloaded successfully!");
  };

  const styles = {
    container: { maxWidth: "700px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px" },
    title: { textAlign: "center", color: "#dc3c3c", marginBottom: "20px", fontSize: "28px" },
    inputGroup: { display: "flex", gap: "10px", marginBottom: "20px" },
    input: { flex: 1, padding: "12px", borderRadius: "8px", border: "2px solid var(--border-color)", background: "var(--bg-glass)", color: "var(--text-primary)" },
    button: { padding: "12px 24px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
    printButton: { padding: "12px 24px", background: "#4caf50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginRight: "10px" },
    downloadButton: { padding: "12px 24px", background: "#2196f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
    messageSuccess: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
    messageError: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
    messageWarning: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" },
    backButton: { width: "100%", padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px" }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🖨️ Print Room Bill (Room + Food)</h2>
      
      {message && (
        <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : message.type === "warning" ? "#fff3cd" : "#f8d7da", color: message.type === "success" ? "#155724" : message.type === "warning" ? "#856404" : "#721c24" }}>
          {message.text}
          {message.remainingAmount && (<div style={{ marginTop: "10px" }}><button onClick={() => navigate("/customer/room-payment")} style={{ padding: "8px 16px", background: "#ff9800", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Pay Now ₹{message.remainingAmount.toLocaleString()}</button></div>)}
        </div>
      )}
      
      <div style={styles.inputGroup}>
        <input type="text" placeholder="Enter Room Number (e.g., 101)" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} style={styles.input} />
        <button onClick={fetchBill} disabled={loading} style={styles.button}>{loading ? "Loading..." : "Get Bill"}</button>
      </div>
      
      {bill && bill.paymentStatus === "paid" && (
        <>
          <div ref={printRef}>
            <div className="invoice-container">
              <div className="invoice-header"><h1>🏨 GRAND HOTEL</h1><div className="invoice-title">PAID INVOICE</div></div>
              <div className="hotel-info"><p>123 Luxury Avenue, Downtown City</p><p>📞 +91 1234567890 | ✉️ info@grandhotel.com</p></div>
              <div className="guest-info">
                <h3>Guest Information</h3>
                <div className="info-grid">
                  <div className="info-item"><strong>Guest Name:</strong><span>{bill.guestName}</span></div>
                  <div className="info-item"><strong>Room Number:</strong><span>{bill.roomNo}</span></div>
                  <div className="info-item"><strong>Room Type:</strong><span>{bill.roomDetails?.roomType}</span></div>
                  <div className="info-item"><strong>Days:</strong><span>{bill.roomDetails?.days}</span></div>
                  <div className="info-item"><strong>Transaction ID:</strong><span>{bill.transactionId || "N/A"}</span></div>
                  <div className="info-item"><strong>Payment Date:</strong><span>{new Date(bill.paymentDate).toLocaleDateString()}</span></div>
                </div>
              </div>
              <div className="section-title">🏠 Room Charges</div>
              <table className="charges-table"><thead><tr><th>Description</th><th>Amount</th></tr></thead>
                <tbody><tr><td>{bill.roomDetails?.roomType} Room ({bill.roomDetails?.days} days)</td><td>₹{bill.roomCharge?.toLocaleString()}</td></tr>
                <tr><td>Food & Beverages</td><td>₹{bill.foodCharge?.toLocaleString()}</td></tr>
                <tr><td>GST (18%)</td><td>₹{bill.tax?.toLocaleString()}</td></tr></tbody>
              </table>
              <div className="total-section"><div className="total-row grand-total"><span>Total Paid:</span><span>₹{bill.total?.toLocaleString()}</span></div></div>
              <div className="payment-status">✅ Payment Status: PAID</div>
              <div className="footer"><p>Thank you for choosing Grand Hotel!</p></div>
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