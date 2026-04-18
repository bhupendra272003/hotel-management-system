import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ThemeToggle from "../ThemeToggle";
import API_URL from "../../api/config";

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    totalBookings: 0, activeBookings: 0, foodOrders: 0, tableBookings: 0,
    totalRevenue: 0, pendingRevenue: 0, totalBills: 0, paidBills: 0, unpaidBills: 0
  });
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [bookingsRes, foodRes, tablesRes, billsRes] = await Promise.all([
        axios.get(`${API_URL}/api/booking`),
        axios.get(`${API_URL}/api/food`),
        axios.get(`${API_URL}/api/table`),
        axios.get(`${API_URL}/api/billing`)
      ]);
      
      const bookings = bookingsRes.data;
      const food = foodRes.data;
      const tables = tablesRes.data;
      const bills = billsRes.data;
      
      const totalRevenue = bills.reduce((sum, b) => sum + (b.totalAmountPaid || b.total || 0), 0);
      const pendingRevenue = bills.filter(b => b.paymentStatus !== "paid").reduce((sum, b) => sum + (b.remainingAmount || b.total || 0), 0);
      
      setStats({
        totalBookings: bookings.length,
        activeBookings: bookings.filter(b => b.status === "CheckedIn").length,
        foodOrders: food.length,
        tableBookings: tables.length,
        totalRevenue, pendingRevenue,
        totalBills: bills.length,
        paidBills: bills.filter(b => b.paymentStatus === "paid").length,
        unpaidBills: bills.filter(b => b.paymentStatus !== "paid").length
      });
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const logout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '20px', background: 'var(--bg-card)', borderRadius: '15px', marginBottom: '30px' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.8rem', color: '#dc3c3c' }}>👑 Admin Dashboard</h1><p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>Welcome back, {user?.name || 'Admin'}!</p></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            {dropdownOpen && (
              <div style={{ position: 'absolute', right: 0, top: '55px', background: 'var(--bg-card)', minWidth: '220px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', zIndex: 1000, overflow: 'hidden', border: '1px solid var(--border-color)', animation: 'fadeInDown 0.3s ease' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)' }}><strong>{user?.name}</strong><p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>{user?.role}</p></div>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', color: 'var(--text-primary)' }} onClick={() => setDropdownOpen(false)}>👤 My Profile</Link>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '5px 0' }}></div>
                <button onClick={logout} style={{ width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#dc3545', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>🚪 Logout</button>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><div className="loading-spinner"></div><p>Loading statistics...</p></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>📅</div><h3>Total Bookings</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalBookings}</p></div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>✅</div><h3>Active Check-ins</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeBookings}</p></div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ffc107, #e0a800)', padding: '20px', borderRadius: '15px', color: '#333', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>🍕</div><h3>Food Orders</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.foodOrders}</p></div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #17a2b8, #138496)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>🍽️</div><h3>Table Bookings</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.tableBookings}</p></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #dc3c3c, #b83232)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>💰</div><h3>Total Revenue</h3><p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{stats.totalRevenue.toLocaleString()}</p></div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>⏳</div><h3>Pending Revenue</h3><p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{stats.pendingRevenue.toLocaleString()}</p></div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4caf50, #388e3c)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>📊</div><h3>Bill Summary</h3><p>Total: {stats.totalBills} | Paid: {stats.paidBills} | Unpaid: {stats.unpaidBills}</p></div>
          </div>
        </>
      )}
      
      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '25px', marginTop: '20px' }}>
        <h2 style={{ color: '#dc3c3c', marginBottom: '20px', borderLeft: '4px solid #dc3c3c', paddingLeft: '15px' }}>🛠️ Management Tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <Link to="/admin/stats" className="dashboard-link" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px', borderRadius: '15px', textDecoration: 'none', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>📊</div><h3>Hotel Statistics</h3><p>View detailed analytics</p></Link>
          <Link to="/admin/staff" className="dashboard-link" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', padding: '20px', borderRadius: '15px', textDecoration: 'none', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>👥</div><h3>Manage Staff</h3><p>Add, edit, remove staff</p></Link>
          <Link to="/admin/tasks" className="dashboard-link" style={{ background: 'linear-gradient(135deg, #ffc107, #e0a800)', padding: '20px', borderRadius: '15px', textDecoration: 'none', color: '#333', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>✅</div><h3>Assign Tasks</h3><p>Create staff tasks</p></Link>
          <Link to="/admin/reports" className="dashboard-link" style={{ background: 'linear-gradient(135deg, #17a2b8, #138496)', padding: '20px', borderRadius: '15px', textDecoration: 'none', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>📈</div><h3>View Reports</h3><p>Generate reports</p></Link>
          <Link to="/admin/bills" className="dashboard-link" style={{ background: 'linear-gradient(135deg, #dc3c3c, #b83232)', padding: '20px', borderRadius: '15px', textDecoration: 'none', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>💰</div><h3>Bill Management</h3><p>Manage all bills</p></Link>
          <Link to="/admin/task-distribution" className="dashboard-link" style={{ background: 'linear-gradient(135deg, #17a2b8, #138496)', padding: '20px', borderRadius: '15px', textDecoration: 'none', color: 'white', textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>📊</div><h3>Task Distribution</h3><p>View and rebalance tasks</p></Link>
        </div>
      </div>
    </div>
  );
}
