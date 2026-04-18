import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

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
  const navigate = useNavigate();

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const [billingRes, foodRes, tableRes, bookingRes] = await Promise.all([
        axios.get(`${API_URL}/api/billing`),
        axios.get(`${API_URL}/api/food`),
        axios.get(`${API_URL}/api/table`),
        axios.get(`${API_URL}/api/booking`)
      ]);
      
      const bills = billingRes.data;
      const foodOrders = foodRes.data;
      const tableBookings = tableRes.data;
      const bookings = bookingRes.data;
      
      const totalRevenue = bills.reduce((s, b) => s + (b.totalAmountPaid || b.total || 0), 0);
      const pendingRevenue = bills.filter(b => b.paymentStatus !== "paid").reduce((s, b) => s + (b.remainingAmount || b.total || 0), 0);
      const roomRevenue = bills.reduce((s, b) => s + (b.roomAmountPaid || b.roomCharge || 0), 0);
      const foodRevenue = bills.reduce((s, b) => s + (b.foodAmountPaid || b.foodCharge || 0), 0);
      const tableRevenue = bills.reduce((s, b) => s + (b.tableAmountPaid || b.tableCharge || 0), 0);
      
      setStats({
        revenue: { total: totalRevenue, pending: pendingRevenue, collected: totalRevenue - pendingRevenue, byCategory: { room: roomRevenue, food: foodRevenue, table: tableRevenue } },
        food: { totalOrders: foodOrders.length, paidOrders: foodOrders.filter(f => f.paymentStatus === "paid").length, totalValue: foodOrders.reduce((s, f) => s + (f.total || 0), 0) },
        tables: { totalBookings: tableBookings.length, confirmed: tableBookings.filter(t => t.bookingStatus === "occupied").length, paid: tableBookings.filter(t => t.paymentStatus === "paid").length, totalValue: tableBookings.reduce((s, t) => s + (t.advanceAmount + (t.totalOrderAmount || 0)), 0) },
        rooms: { totalBookings: bookings.length, activeCheckins: bookings.filter(b => b.status === "CheckedIn").length, completed: bookings.filter(b => b.status === "Completed").length },
        recentTransactions: bills.filter(b => b.paymentStatus === "paid").slice(0, 10)
      });
    } catch (error) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
    let interval;
    if (autoRefresh) interval = setInterval(fetchStatistics, 30000);
    return () => { if (interval) clearInterval(interval); };
  }, [autoRefresh, fetchStatistics]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#dc3c3c' }}>📊 Hotel Statistics</h2>
        <div><button onClick={fetchStatistics} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🔄 Refresh</button>
        <label style={{ marginLeft: '10px' }}><input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} /> Auto-refresh (30s)</label></div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{stats.revenue.total.toLocaleString()}</div><div>Total Revenue</div></div>
        <div style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{stats.revenue.collected.toLocaleString()}</div><div>Collected</div></div>
        <div style={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{stats.revenue.pending.toLocaleString()}</div><div>Pending</div></div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate("/admin/bills")}><div style={{ fontSize: '24px' }}>🏠</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>₹{stats.revenue.byCategory.room.toLocaleString()}</div><div>Room Revenue</div></div>
        <div style={{ background: '#d4edda', padding: '20px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate("/admin/bills")}><div style={{ fontSize: '24px' }}>🍕</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>₹{stats.revenue.byCategory.food.toLocaleString()}</div><div>Food Revenue</div></div>
        <div style={{ background: '#d1ecf1', padding: '20px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate("/admin/bills")}><div style={{ fontSize: '24px' }}>🍽️</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>₹{stats.revenue.byCategory.table.toLocaleString()}</div><div>Table Revenue</div></div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}><div style={{ fontSize: '24px' }}>🏠</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>{stats.rooms.totalBookings}</div><div>Total Room Bookings</div><div>Active: {stats.rooms.activeCheckins}</div></div>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}><div style={{ fontSize: '24px' }}>🍕</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>{stats.food.totalOrders}</div><div>Food Orders</div><div>Paid: {stats.food.paidOrders}</div></div>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}><div style={{ fontSize: '24px' }}>🍽️</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>{stats.tables.totalBookings}</div><div>Table Bookings</div><div>Confirmed: {stats.tables.confirmed}</div></div>
      </div>
      
      <button onClick={() => navigate("/admin")} style={{ marginTop: '20px', padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back to Dashboard</button>
    </div>
  );
}