import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HotelStats() {
  const [stats, setStats] = useState({
    revenue: { total: 0, pending: 0, collected: 0, byCategory: { room: 0, food: 0, table: 0 } },
    food: { totalOrders: 0, paidOrders: 0, totalValue: 0 },
    tables: { totalBookings: 0, confirmed: 0, paid: 0, totalValue: 0 },
    rooms: { totalBookings: 0, activeCheckins: 0, completed: 0 },
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/api";

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [billingRes, foodRes, tableRes, bookingRes] = await Promise.all([
        axios.get(`${API_URL}/billing`),
        axios.get(`${API_URL}/food`),
        axios.get(`${API_URL}/table`),
        axios.get(`${API_URL}/booking`)
      ]);
      
      const bills = billingRes.data;
      const foodOrders = foodRes.data;
      const tableBookings = tableRes.data;
      const bookings = bookingRes.data;
      
      const totalRevenue = bills.reduce((sum, b) => sum + (b.totalAmountPaid || b.total || 0), 0);
      const pendingRevenue = bills.filter(b => b.paymentStatus !== "paid").reduce((sum, b) => sum + (b.remainingAmount || b.total || 0), 0);
      
      const roomRevenue = bills.reduce((sum, b) => sum + (b.roomAmountPaid || b.roomCharge || 0), 0);
      const foodRevenue = bills.reduce((sum, b) => sum + (b.foodAmountPaid || b.foodCharge || 0), 0);
      const tableRevenue = bills.reduce((sum, b) => sum + (b.tableAmountPaid || b.tableCharge || 0), 0);
      
      setStats({
        revenue: {
          total: totalRevenue,
          pending: pendingRevenue,
          collected: totalRevenue - pendingRevenue,
          byCategory: { room: roomRevenue, food: foodRevenue, table: tableRevenue }
        },
        food: {
          totalOrders: foodOrders.length,
          paidOrders: foodOrders.filter(f => f.paymentStatus === "paid").length,
          totalValue: foodOrders.reduce((sum, f) => sum + (f.total || 0), 0)
        },
        tables: {
          totalBookings: tableBookings.length,
          confirmed: tableBookings.filter(t => t.bookingStatus === "occupied" || t.status === "confirmed").length,
          paid: tableBookings.filter(t => t.paymentStatus === "paid").length,
          totalValue: tableBookings.reduce((sum, t) => sum + (t.advanceAmount + (t.totalOrderAmount || 0)), 0)
        },
        rooms: {
          totalBookings: bookings.length,
          activeCheckins: bookings.filter(b => b.status === "CheckedIn").length,
          completed: bookings.filter(b => b.status === "Completed").length
        },
        recentTransactions: bills.filter(b => b.paymentStatus === "paid").slice(0, 10)
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError("Failed to load statistics. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchStatistics();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchStatistics, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchStatistics]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "15px", color: "#666" }}>Loading statistics...</p>
        <style>{`
          .loading-spinner { width: 50px; height: 50px; border: 4px solid #f0f0f0; border-top-color: #dc3c3c; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <p style={{ color: "#dc3545", marginBottom: "20px", fontSize: "16px" }}>{error}</p>
        <button onClick={fetchStatistics} style={{ padding: "10px 20px", background: "#dc3c3c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "40px auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ fontSize: "32px", color: "#1a1a2e", marginBottom: "5px" }}>📊 Hotel Statistics</h1>
          <p style={{ color: "#666", fontSize: "14px" }}>Real-time analytics and performance metrics</p>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
          {lastUpdated && (
            <span style={{ fontSize: "12px", color: "#999" }}>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button onClick={fetchStatistics} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #28a745, #20c997)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🔄</span> Refresh
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
            <span style={{ fontSize: "14px", color: "#666" }}>Auto-refresh (30s)</span>
          </label>
        </div>
      </div>
      
      {/* Revenue Overview Cards */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333", paddingLeft: "10px", borderLeft: "4px solid #dc3c3c" }}>💰 Revenue Overview</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "25px", borderRadius: "20px", color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", transition: "transform 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", opacity: "0.8", marginBottom: "5px" }}>Total Revenue</div>
                <div style={{ fontSize: "32px", fontWeight: "bold" }}>₹{stats.revenue.total.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: "48px" }}>💰</div>
            </div>
            <div style={{ marginTop: "15px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
              <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.5)", borderRadius: "2px" }}></div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)", padding: "25px", borderRadius: "20px", color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", transition: "transform 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", opacity: "0.8", marginBottom: "5px" }}>Collected Amount</div>
                <div style={{ fontSize: "32px", fontWeight: "bold" }}>₹{stats.revenue.collected.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: "48px" }}>✅</div>
            </div>
            <div style={{ marginTop: "15px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
              <div style={{ width: `${(stats.revenue.collected / stats.revenue.total) * 100}%`, height: "100%", background: "rgba(255,255,255,0.5)", borderRadius: "2px" }}></div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)", padding: "25px", borderRadius: "20px", color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", transition: "transform 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", opacity: "0.8", marginBottom: "5px" }}>Pending Amount</div>
                <div style={{ fontSize: "32px", fontWeight: "bold" }}>₹{stats.revenue.pending.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: "48px" }}>⏳</div>
            </div>
            <div style={{ marginTop: "15px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
              <div style={{ width: `${(stats.revenue.pending / stats.revenue.total) * 100}%`, height: "100%", background: "rgba(255,255,255,0.5)", borderRadius: "2px" }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue by Category */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333", paddingLeft: "10px", borderLeft: "4px solid #dc3c3c" }}>📈 Revenue by Category</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
          <div style={{ background: "linear-gradient(135deg, #fff5f0 0%, #ffe8e0 100%)", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", transition: "transform 0.3s ease", cursor: "pointer" }} onClick={() => navigate("/admin/bills")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ fontSize: "36px" }}>🏠</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#dc3545" }}>₹{stats.revenue.byCategory.room.toLocaleString()}</div>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>Room Revenue</div>
            <div style={{ fontSize: "13px", color: "#666" }}>From room bookings and stays</div>
            <div style={{ marginTop: "15px", height: "6px", background: "#e0e0e0", borderRadius: "3px" }}>
              <div style={{ width: `${(stats.revenue.byCategory.room / stats.revenue.total) * 100}%`, height: "100%", background: "#dc3545", borderRadius: "3px" }}></div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#999", textAlign: "right" }}>
              {((stats.revenue.byCategory.room / stats.revenue.total) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", transition: "transform 0.3s ease", cursor: "pointer" }} onClick={() => navigate("/admin/bills")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ fontSize: "36px" }}>🍕</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#28a745" }}>₹{stats.revenue.byCategory.food.toLocaleString()}</div>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>Food Revenue</div>
            <div style={{ fontSize: "13px", color: "#666" }}>From restaurant and room service</div>
            <div style={{ marginTop: "15px", height: "6px", background: "#e0e0e0", borderRadius: "3px" }}>
              <div style={{ width: `${(stats.revenue.byCategory.food / stats.revenue.total) * 100}%`, height: "100%", background: "#28a745", borderRadius: "3px" }}></div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#999", textAlign: "right" }}>
              {((stats.revenue.byCategory.food / stats.revenue.total) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", transition: "transform 0.3s ease", cursor: "pointer" }} onClick={() => navigate("/admin/bills")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ fontSize: "36px" }}>🍽️</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#17a2b8" }}>₹{stats.revenue.byCategory.table.toLocaleString()}</div>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>Table Revenue</div>
            <div style={{ fontSize: "13px", color: "#666" }}>From table bookings and orders</div>
            <div style={{ marginTop: "15px", height: "6px", background: "#e0e0e0", borderRadius: "3px" }}>
              <div style={{ width: `${(stats.revenue.byCategory.table / stats.revenue.total) * 100}%`, height: "100%", background: "#17a2b8", borderRadius: "3px" }}></div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#999", textAlign: "right" }}>
              {((stats.revenue.byCategory.table / stats.revenue.total) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Metrics */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333", paddingLeft: "10px", borderLeft: "4px solid #dc3c3c" }}>📊 Business Metrics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          <div style={{ background: "#ffffff", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", border: "1px solid #e8e8e8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{ fontSize: "40px" }}>🏠</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#dc3c3c" }}>{stats.rooms.totalBookings}</div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Room Bookings</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #f0f0f0" }}>
              <span style={{ color: "#666" }}>Active Check-ins</span>
              <span style={{ fontWeight: "600", color: "#28a745" }}>{stats.rooms.activeCheckins}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ color: "#666" }}>Completed Stays</span>
              <span style={{ fontWeight: "600", color: "#6c757d" }}>{stats.rooms.completed}</span>
            </div>
            <div style={{ marginTop: "15px" }}>
              <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px" }}>
                <div style={{ width: `${(stats.rooms.activeCheckins / stats.rooms.totalBookings) * 100}%`, height: "100%", background: "#28a745", borderRadius: "4px" }}></div>
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>Occupancy Rate: {((stats.rooms.activeCheckins / stats.rooms.totalBookings) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div style={{ background: "#ffffff", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", border: "1px solid #e8e8e8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{ fontSize: "40px" }}>🍕</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>{stats.food.totalOrders}</div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Food Orders</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #f0f0f0" }}>
              <span style={{ color: "#666" }}>Paid Orders</span>
              <span style={{ fontWeight: "600", color: "#28a745" }}>{stats.food.paidOrders}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ color: "#666" }}>Total Value</span>
              <span style={{ fontWeight: "600", color: "#ff9800" }}>₹{stats.food.totalValue.toLocaleString()}</span>
            </div>
            <div style={{ marginTop: "15px" }}>
              <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px" }}>
                <div style={{ width: `${(stats.food.paidOrders / stats.food.totalOrders) * 100}%`, height: "100%", background: "#28a745", borderRadius: "4px" }}></div>
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>Payment Rate: {((stats.food.paidOrders / stats.food.totalOrders) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div style={{ background: "#ffffff", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", border: "1px solid #e8e8e8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{ fontSize: "40px" }}>🍽️</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#17a2b8" }}>{stats.tables.totalBookings}</div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Table Bookings</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #f0f0f0" }}>
              <span style={{ color: "#666" }}>Confirmed</span>
              <span style={{ fontWeight: "600", color: "#28a745" }}>{stats.tables.confirmed}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ color: "#666" }}>Total Value</span>
              <span style={{ fontWeight: "600", color: "#17a2b8" }}>₹{stats.tables.totalValue.toLocaleString()}</span>
            </div>
            <div style={{ marginTop: "15px" }}>
              <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px" }}>
                <div style={{ width: `${(stats.tables.confirmed / stats.tables.totalBookings) * 100}%`, height: "100%", background: "#28a745", borderRadius: "4px" }}></div>
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>Confirmation Rate: {((stats.tables.confirmed / stats.tables.totalBookings) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      {stats.recentTransactions.length > 0 && (
        <div>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333", paddingLeft: "10px", borderLeft: "4px solid #dc3c3c" }}>📋 Recent Transactions</h2>
          <div style={{ overflowX: "auto", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "12px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #dc3c3c, #b83232)", color: "white" }}>
                  <th style={{ padding: "15px", textAlign: "left" }}>Bill ID</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>Guest Name</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>Amount</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>Payment Method</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>Transaction ID</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((transaction, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e0e0e0", background: idx % 2 === 0 ? "#fafafa" : "white" }}>
                    <td style={{ padding: "12px 15px", color: "#333", fontWeight: "500" }}>#{transaction._id?.slice(-6)}</td>
                    <td style={{ padding: "12px 15px", color: "#333" }}>{transaction.guestName}</td>
                    <td style={{ padding: "12px 15px", color: "#28a745", fontWeight: "600" }}>₹{transaction.total?.toLocaleString()}</td>
                    <td style={{ padding: "12px 15px", color: "#555" }}>{transaction.paymentMethod?.toUpperCase() || "CASH"}</td>
                    <td style={{ padding: "12px 15px", color: "#555", fontFamily: "monospace", fontSize: "12px" }}>{transaction.transactionId || "N/A"}</td>
                    <td style={{ padding: "12px 15px", color: "#555" }}>{new Date(transaction.paymentDate || transaction.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button onClick={() => navigate("/admin")} style={{ padding: "12px 25px", background: "#6c757d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "all 0.3s ease" }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}