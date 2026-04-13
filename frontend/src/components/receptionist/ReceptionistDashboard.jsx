import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ThemeToggle from "../ThemeToggle";

export default function ReceptionistDashboard({ user }) {
  const [stats, setStats] = useState({
    pendingCheckins: 0,
    todayBookings: 0,
    pendingOrders: 0,
    pendingTables: 0,
    occupiedTables: 0,
    availableTables: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const bookingsRes = await axios.get("http://localhost:5000/api/booking");
      const foodRes = await axios.get("http://localhost:5000/api/food");
      const tableRes = await axios.get("http://localhost:5000/api/table");
      
      setStats({
        pendingCheckins: bookingsRes.data.filter(b => b.status === "Booked").length,
        todayBookings: bookingsRes.data.filter(b => 
          new Date(b.createdAt).toDateString() === new Date().toDateString()
        ).length,
        pendingOrders: foodRes.data.filter(f => f.status !== "delivered" && f.status !== "cancelled").length,
        pendingTables: tableRes.data.filter(t => t.bookingStatus === "booked").length,
        occupiedTables: tableRes.data.filter(t => t.bookingStatus === "occupied").length,
        availableTables: tableRes.data.filter(t => t.bookingStatus === "available").length
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="dashboard receptionist-dashboard" style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px',
        background: 'var(--bg-card)',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#dc3c3c' }}>👔 Receptionist Dashboard</h1>
          <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name || 'Receptionist'}! {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Refresh Button */}
          <button
            onClick={fetchStats}
            style={{
              padding: '10px 15px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🔄 Refresh
          </button>
          
          {/* Profile Button */}
          <Link 
            to="/receptionist/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #17a2b8, #138496)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '40px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(23,162,184,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '18px' }}>👤</span>
            <span>My Profile</span>
          </Link>
          
          <ThemeToggle />
          
          <button
            onClick={logout}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #dc3545, #c82333)',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div className="loading-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: '25px',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2rem' }}>⏳</div>
              <h3>Pending Check-ins</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.pendingCheckins}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Guests waiting to check in</p>
            </div>
            
            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              padding: '25px',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2rem' }}>📅</div>
              <h3>Today's Bookings</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.todayBookings}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>New reservations today</p>
            </div>
            
            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, #ffc107, #e0a800)',
              padding: '25px',
              borderRadius: '15px',
              color: '#333',
              textAlign: 'center',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2rem' }}>🍕</div>
              <h3>Pending Orders</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.pendingOrders}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Food orders to process</p>
            </div>
            
            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, #17a2b8, #138496)',
              padding: '25px',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2rem' }}>🍽️</div>
              <h3>Table Bookings</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.pendingTables}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Pending table reservations</p>
            </div>
          </div>

          {/* Additional Table Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, #ff9800, #f57c00)',
              padding: '20px',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem' }}>🪑</div>
              <h3>Occupied Tables</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.occupiedTables}</p>
            </div>
            
            <div className="stat-card" style={{
              background: 'linear-gradient(135deg, #4caf50, #388e3c)',
              padding: '20px',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem' }}>🪑</div>
              <h3>Available Tables</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{stats.availableTables}</p>
            </div>
          </div>
        </>
      )}

      {/* Dashboard Links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <Link to="/receptionist/booking" className="dashboard-link" style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          padding: '20px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '2rem' }}>📅</div>
          <h3>New Room Booking</h3>
          <p>Create a new room reservation</p>
        </Link>

        <Link to="/receptionist/checkinout" className="dashboard-link" style={{
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          padding: '20px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '2rem' }}>✅</div>
          <h3>Check In / Out</h3>
          <p>Manage guest check-ins and check-outs</p>
        </Link>

        <Link to="/receptionist/confirm-orders" className="dashboard-link" style={{
          background: 'linear-gradient(135deg, #ffc107, #e0a800)',
          padding: '20px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: '#333',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '2rem' }}>🍕</div>
          <h3>Confirm Food Orders</h3>
          <p>Review and confirm food orders</p>
        </Link>

        <Link to="/receptionist/confirm-tables" className="dashboard-link" style={{
          background: 'linear-gradient(135deg, #17a2b8, #138496)',
          padding: '20px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '2rem' }}>🍽️</div>
          <h3>Confirm Table Bookings</h3>
          <p>Review and confirm table reservations</p>
        </Link>

        {/* NEW: Manage Tables Link */}
        <Link to="/receptionist/tables" className="dashboard-link" style={{
          background: 'linear-gradient(135deg, #ff9800, #f57c00)',
          padding: '20px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '2rem' }}>🪑</div>
          <h3>Manage Tables</h3>
          <p>Mark tables as occupied/free</p>
        </Link>

   
      </div>

      <style>{`
        .dashboard-link:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .stat-card {
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid var(--border-color);
          border-top-color: #dc3c3c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}