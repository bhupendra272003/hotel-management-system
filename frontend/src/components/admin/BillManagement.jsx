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
    else if (filter === "food") setFilteredBills(bills.filter(b => b.foodCharge > 0));
    else if (filter === "table") setFilteredBills(bills.filter(b => b.billType === "table" || b.tableCharge > 0));
    else if (filter === "paid") setFilteredBills(bills.filter(b => b.paymentStatus === "paid"));
    else if (filter === "unpaid") setFilteredBills(bills.filter(b => b.paymentStatus === "unpaid"));
  }, [bills, filter]);

  useEffect(() => { fetchBills(); }, []);
  useEffect(() => { filterBills(); }, [filterBills]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/billing`);
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
      await axios.put(`${API_URL}/api/billing/pay/${id}`, { paymentMethod: "cash", paymentStatus: "paid", paymentDate: new Date() });
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
      await axios.delete(`${API_URL}/api/billing/${id}`);
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

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading bills...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#dc3c3c' }}>💰 Bill Management</h2>
      {message && <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>{message.text}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{stats.total.toLocaleString()}</div><div>Total Revenue</div></div>
        <div style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{stats.paid.toLocaleString()}</div><div>Paid Amount</div></div>
        <div style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{stats.unpaid.toLocaleString()}</div><div>Unpaid Amount</div></div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div onClick={() => setFilter("room")} style={{ background: '#fff3cd', padding: '15px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '24px' }}>🏠</div><div><strong>Room</strong></div><div>₹{stats.roomTotal.toLocaleString()}</div></div>
        <div onClick={() => setFilter("food")} style={{ background: '#d4edda', padding: '15px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '24px' }}>🍕</div><div><strong>Food</strong></div><div>₹{stats.foodTotal.toLocaleString()}</div></div>
        <div onClick={() => setFilter("table")} style={{ background: '#d1ecf1', padding: '15px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '24px' }}>🍽️</div><div><strong>Table</strong></div><div>₹{stats.tableTotal.toLocaleString()}</div></div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', justifyContent: 'center' }}>
        <button onClick={() => setFilter("all")} style={{ padding: '8px 16px', background: filter === "all" ? "#dc3c3c" : "#e0e0e0", color: filter === "all" ? "white" : "#333", border: "none", borderRadius: "20px", cursor: "pointer" }}>All Bills</button>
        <button onClick={() => setFilter("room")} style={{ padding: '8px 16px', background: filter === "room" ? "#dc3c3c" : "#e0e0e0", color: filter === "room" ? "white" : "#333", border: "none", borderRadius: "20px", cursor: "pointer" }}>🏠 Room</button>
        <button onClick={() => setFilter("food")} style={{ padding: '8px 16px', background: filter === "food" ? "#dc3c3c" : "#e0e0e0", color: filter === "food" ? "white" : "#333", border: "none", borderRadius: "20px", cursor: "pointer" }}>🍕 Food</button>
        <button onClick={() => setFilter("table")} style={{ padding: '8px 16px', background: filter === "table" ? "#dc3c3c" : "#e0e0e0", color: filter === "table" ? "white" : "#333", border: "none", borderRadius: "20px", cursor: "pointer" }}>🍽️ Table</button>
        <button onClick={() => setFilter("paid")} style={{ padding: '8px 16px', background: filter === "paid" ? "#28a745" : "#e0e0e0", color: filter === "paid" ? "white" : "#333", border: "none", borderRadius: "20px", cursor: "pointer" }}>✅ Paid</button>
        <button onClick={() => setFilter("unpaid")} style={{ padding: '8px 16px', background: filter === "unpaid" ? "#dc3545" : "#e0e0e0", color: filter === "unpaid" ? "white" : "#333", border: "none", borderRadius: "20px", cursor: "pointer" }}>❌ Unpaid</button>
      </div>
      
      {filteredBills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '12px' }}><div style={{ fontSize: '48px' }}>📋</div><p>No bills found</p></div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            <thead><tr style={{ background: '#dc3c3c', color: 'white' }}>
              <th style={{ padding: '12px' }}>ID</th><th>Type</th><th>Guest</th><th>Room/Table</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filteredBills.map((bill, idx) => (
                <tr key={bill._id} style={{ borderBottom: '1px solid #ddd', background: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '10px' }}>#{bill._id.slice(-6)}</td>
                  <td style={{ padding: '10px' }}>{bill.billType === "table" ? "🍽️ Table" : bill.foodCharge > 0 && bill.roomCharge === 0 ? "🍕 Food" : bill.roomCharge > 0 && bill.foodCharge === 0 ? "🏠 Room" : "📦 Combined"}</td>
                  <td style={{ padding: '10px' }}>{bill.guestName || "N/A"}</td>
                  <td style={{ padding: '10px' }}>{bill.tableBookings?.[0]?.tableNumber || bill.roomNo || "N/A"}</td>
                  <td style={{ padding: '10px' }}>₹{bill.total?.toLocaleString() || 0}</td>
                  <td style={{ padding: '10px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: bill.paymentStatus === "paid" ? "#d4edda" : "#f8d7da", color: bill.paymentStatus === "paid" ? "#155724" : "#721c24" }}>{bill.paymentStatus === "paid" ? "✅ Paid" : "⏳ Unpaid"}</span></td>
                  <td style={{ padding: '10px' }}>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => setSelectedBill(bill)} style={{ marginRight: '5px', background: '#2196f3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>View</button>
                    {bill.paymentStatus !== "paid" && <button onClick={() => markAsPaid(bill._id)} style={{ marginRight: '5px', background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Mark Paid</button>}
                    <button onClick={() => deleteBill(bill._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSelectedBill(null)}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '500px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h3>Bill Details</h3>
            <p><strong>Bill ID:</strong> {selectedBill._id}</p>
            <p><strong>Guest:</strong> {selectedBill.guestName}</p>
            <p><strong>Room/Table:</strong> {selectedBill.roomNo}</p>
            <hr />
            <p><strong>Room Charge:</strong> ₹{selectedBill.roomCharge?.toLocaleString() || 0}</p>
            <p><strong>Food Charge:</strong> ₹{selectedBill.foodCharge?.toLocaleString() || 0}</p>
            <p><strong>Table Charge:</strong> ₹{selectedBill.tableCharge?.toLocaleString() || 0}</p>
            <p><strong>Tax:</strong> ₹{selectedBill.tax?.toLocaleString() || 0}</p>
            <p><strong>Total:</strong> ₹{selectedBill.total?.toLocaleString() || 0}</p>
            <p><strong>Status:</strong> {selectedBill.paymentStatus === "paid" ? "Paid" : "Unpaid"}</p>
            <button onClick={() => setSelectedBill(null)} style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
      
      <button onClick={() => navigate("/admin")} style={{ marginTop: '30px', padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back to Dashboard</button>
    </div>
  );
}