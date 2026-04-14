import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function BillManagement() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const filterBills = useCallback(() => {
    if (filter === "all") setFilteredBills(bills);
    else if (filter === "room") setFilteredBills(bills.filter(b => b.billType === "combined" || b.roomCharge > 0));
    else if (filter === "food") setFilteredBills(bills.filter(b => b.foodCharge > 0 && b.foodOrders?.length > 0));
    else if (filter === "table") setFilteredBills(bills.filter(b => b.billType === "table" || b.tableCharge > 0));
    else if (filter === "paid") setFilteredBills(bills.filter(b => b.paymentStatus === "paid"));
    else if (filter === "unpaid") setFilteredBills(bills.filter(b => b.paymentStatus === "unpaid"));
  }, [bills, filter]);

  useEffect(() => { fetchBills(); }, []);
  useEffect(() => { filterBills(); }, [filterBills]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/billing`);
      setBills(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch bills" });
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    if (!window.confirm("Mark this bill as paid?")) return;
    try {
      await axios.put(`${API_URL}/billing/pay/${id}`, { paymentMethod: "cash", paymentStatus: "paid", paymentDate: new Date() });
      setMessage({ type: "success", text: "✅ Bill marked as paid!" });
      fetchBills();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to mark bill as paid" });
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try {
      await axios.delete(`${API_URL}/billing/${id}`);
      setMessage({ type: "success", text: "✅ Bill deleted!" });
      fetchBills();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete bill" });
    }
  };

  const getStats = () => {
    const total = bills.reduce((s, b) => s + (b.total || 0), 0);
    const paid = bills.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + (b.total || 0), 0);
    const unpaid = bills.filter(b => b.paymentStatus === "unpaid").reduce((s, b) => s + (b.total || 0), 0);
    const roomTotal = bills.reduce((s, b) => s + (b.roomCharge || 0), 0);
    const foodTotal = bills.reduce((s, b) => s + (b.foodCharge || 0), 0);
    const tableTotal = bills.reduce((s, b) => s + (b.tableCharge || 0), 0);
    return { total, paid, unpaid, roomTotal, foodTotal, tableTotal };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "15px", color: "#666" }}>Loading bills...</p>
        <style>{`
          .loading-spinner { width: 50px; height: 50px; border: 4px solid #f0f0f0; border-top-color: #dc3c3c; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "40px auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", color: "#1a1a2e", marginBottom: "10px" }}>💰 Bill Management</h1>
        <p style={{ color: "#666", fontSize: "14px" }}>Manage all bills - Room, Food, and Table charges</p>
      </div>
      
      {message && (
        <div style={{ padding: "12px 20px", borderRadius: "10px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>
          {message.text}
        </div>
      )}
      
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button onClick={fetchBills} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #28a745, #20c997)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>🔄 Refresh</button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "25px", borderRadius: "20px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: "14px", opacity: "0.8", marginBottom: "5px" }}>Total Revenue</div><div style={{ fontSize: "32px", fontWeight: "bold" }}>₹{stats.total.toLocaleString()}</div></div>
            <div style={{ fontSize: "40px" }}>💰</div>
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)", padding: "25px", borderRadius: "20px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: "14px", opacity: "0.8", marginBottom: "5px" }}>Paid Amount</div><div style={{ fontSize: "32px", fontWeight: "bold" }}>₹{stats.paid.toLocaleString()}</div></div>
            <div style={{ fontSize: "40px" }}>✅</div>
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)", padding: "25px", borderRadius: "20px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: "14px", opacity: "0.8", marginBottom: "5px" }}>Unpaid Amount</div><div style={{ fontSize: "32px", fontWeight: "bold" }}>₹{stats.unpaid.toLocaleString()}</div></div>
            <div style={{ fontSize: "40px" }}>⏳</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div onClick={() => setFilter("room")} style={{ background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", padding: "20px", borderRadius: "15px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "36px" }}>🏠</div><div style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginTop: "10px" }}>Room Revenue</div><div style={{ fontSize: "20px", fontWeight: "bold", color: "#dc3545", marginTop: "5px" }}>₹{stats.roomTotal.toLocaleString()}</div>
        </div>
        <div onClick={() => setFilter("food")} style={{ background: "linear-gradient(135deg, #d4edda 0%, #a8e6cf 100%)", padding: "20px", borderRadius: "15px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "36px" }}>🍕</div><div style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginTop: "10px" }}>Food Revenue</div><div style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745", marginTop: "5px" }}>₹{stats.foodTotal.toLocaleString()}</div>
        </div>
        <div onClick={() => setFilter("table")} style={{ background: "linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)", padding: "20px", borderRadius: "15px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "36px" }}>🍽️</div><div style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginTop: "10px" }}>Table Revenue</div><div style={{ fontSize: "20px", fontWeight: "bold", color: "#17a2b8", marginTop: "5px" }}>₹{stats.tableTotal.toLocaleString()}</div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "25px", justifyContent: "center" }}>
        {["all", "room", "food", "table", "paid", "unpaid"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", background: filter === f ? "#dc3c3c" : "#f0f0f0", color: filter === f ? "white" : "#333", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
            {f === "all" ? "All Bills" : f === "room" ? "🏠 Room" : f === "food" ? "🍕 Food" : f === "table" ? "🍽️ Table" : f === "paid" ? "✅ Paid" : "❌ Unpaid"}
          </button>
        ))}
      </div>
      
      {filteredBills.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#f8f9fa", borderRadius: "15px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📋</div><p style={{ color: "#666", fontSize: "16px" }}>No bills found</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: "15px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #dc3c3c, #b83232)", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left" }}>Bill ID</th><th>Type</th><th>Guest Name</th><th>Room/Table</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill, idx) => (
                <tr key={bill._id} style={{ borderBottom: "1px solid #e0e0e0", background: idx % 2 === 0 ? "#fafafa" : "white" }}>
                  <td style={{ padding: "12px 15px", color: "#333", fontWeight: "500" }}>#{bill._id.slice(-6)}</td>
                  <td style={{ padding: "12px 15px", color: "#555" }}>{bill.billType === "table" ? "🍽️ Table" : bill.foodCharge > 0 && bill.roomCharge === 0 ? "🍕 Food" : bill.roomCharge > 0 && bill.foodCharge === 0 ? "🏠 Room" : "📦 Combined"}</td>
                  <td style={{ padding: "12px 15px", color: "#333" }}>{bill.guestName || "N/A"}</td>
                  <td style={{ padding: "12px 15px", color: "#333", fontWeight: "500" }}>{bill.tableBookings?.[0]?.tableNumber || bill.roomNo || "N/A"}</td>
                  <td style={{ padding: "12px 15px", color: "#333", fontWeight: "600" }}>₹{bill.total?.toLocaleString() || 0}</td>
                  <td style={{ padding: "12px 15px" }}><span style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: bill.paymentStatus === "paid" ? "#d4edda" : "#f8d7da", color: bill.paymentStatus === "paid" ? "#155724" : "#721c24" }}>{bill.paymentStatus === "paid" ? "✅ Paid" : "⏳ Unpaid"}</span></td>
                  <td style={{ padding: "12px 15px", color: "#555" }}>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 15px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setSelectedBill(bill)} style={{ padding: "6px 12px", background: "#2196f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>View</button>
                      {bill.paymentStatus !== "paid" && <button onClick={() => markAsPaid(bill._id)} style={{ padding: "6px 12px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Mark Paid</button>}
                      <button onClick={() => deleteBill(bill._id)} style={{ padding: "6px 12px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedBill && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)" }} onClick={() => setSelectedBill(null)}>
          <div style={{ background: "white", padding: "35px", borderRadius: "20px", maxWidth: "500px", width: "90%" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#dc3c3c", marginBottom: "20px", fontSize: "24px" }}>Bill Details</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <p><strong>Bill ID:</strong> <span style={{ color: "#555" }}>{selectedBill._id}</span></p>
              <p><strong>Guest Name:</strong> <span style={{ color: "#555" }}>{selectedBill.guestName}</span></p>
              <p><strong>Room/Table:</strong> <span style={{ color: "#555" }}>{selectedBill.roomNo}</span></p>
              <hr />
              <p><strong>Room Charge:</strong> <span style={{ color: "#28a745", fontWeight: "bold" }}>₹{selectedBill.roomCharge?.toLocaleString() || 0}</span></p>
              <p><strong>Food Charge:</strong> <span style={{ color: "#ff9800", fontWeight: "bold" }}>₹{selectedBill.foodCharge?.toLocaleString() || 0}</span></p>
              <p><strong>Table Charge:</strong> <span style={{ color: "#17a2b8", fontWeight: "bold" }}>₹{selectedBill.tableCharge?.toLocaleString() || 0}</span></p>
              <p><strong>Tax (18%):</strong> <span style={{ color: "#6c757d" }}>₹{selectedBill.tax?.toLocaleString() || 0}</span></p>
              <hr />
              <p style={{ fontSize: "18px" }}><strong>Total Amount:</strong> <span style={{ color: "#dc3c3c", fontWeight: "bold" }}>₹{selectedBill.total?.toLocaleString() || 0}</span></p>
              <p><strong>Paid Amount:</strong> <span style={{ color: "#28a745", fontWeight: "bold" }}>₹{selectedBill.totalAmountPaid?.toLocaleString() || 0}</span></p>
              <p><strong>Remaining:</strong> <span style={{ color: selectedBill.remainingAmount > 0 ? "#dc3545" : "#28a745", fontWeight: "bold" }}>₹{selectedBill.remainingAmount?.toLocaleString() || 0}</span></p>
              <p><strong>Status:</strong> <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", background: selectedBill.paymentStatus === "paid" ? "#d4edda" : "#f8d7da", color: selectedBill.paymentStatus === "paid" ? "#155724" : "#721c24", display: "inline-block" }}>{selectedBill.paymentStatus === "paid" ? "✅ Paid" : "⏳ Unpaid"}</span></p>
            </div>
            <button onClick={() => setSelectedBill(null)} style={{ marginTop: "25px", width: "100%", padding: "12px", background: "#dc3c3c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}>Close</button>
          </div>
        </div>
      )}
      
      <button onClick={() => navigate("/admin")} style={{ display: "block", margin: "30px auto", padding: "12px 25px", background: "#6c757d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>← Back to Dashboard</button>
    </div>
  );
}
