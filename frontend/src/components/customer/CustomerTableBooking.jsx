import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function CustomerDashboard() {
  return (
    <div className="customer-dashboard" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#dc3c3c' }}>🏨 Welcome to Grand Hotel</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <ThemeToggle />
            <Link to="/login" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #dc3c3c, #b83232)', color: 'white', textDecoration: 'none', borderRadius: '25px', fontWeight: '600' }}>Staff Login</Link>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '15px' }}>Experience luxury and comfort at its finest</p>
      </div>
      
      <div className="customer-services">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c5282' }}>📋 Booking Services</h2>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          <Link to="/customer/booking" className="service-card" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>📅</div>
            <h3 style={{ color: 'white' }}>Book a Room</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Luxury rooms with stunning views</p>
          </Link>
          
          <Link to="/customer/table" className="service-card" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: 'white' }}>Book a Table</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Reserve your dining experience</p>
          </Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c5282' }}>🍕 Food Ordering</h2>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          <Link to="/customer/food" className="service-card" style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🏠</div>
            <h3 style={{ color: 'white' }}>Order Food (Room)</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Delivered to your room</p>
          </Link>
          
          <Link to="/customer/table-food" className="service-card" style={{ background: 'linear-gradient(135deg, #f2994a, #f2c94c)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: 'white' }}>Order Food (Table)</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Order from your table</p>
          </Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c5282' }}>💰 Room Services</h2>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          <Link to="/customer/room-payment" className="service-card" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>💰</div>
            <h3 style={{ color: 'white' }}>Pay Room Bill</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Pay for room stay + food orders</p>
          </Link>
          
          <Link to="/customer/print-room-bill" className="service-card" style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🖨️</div>
            <h3 style={{ color: 'white' }}>Print Room Bill</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Download room + food invoice</p>
          </Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c5282' }}>🍽️ Table Services</h2>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          <Link to="/customer/table-payment" className="service-card" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>💰</div>
            <h3 style={{ color: 'white' }}>Pay Table Bill</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Pay for table booking + orders</p>
          </Link>
          
          <Link to="/customer/print-table-bill" className="service-card" style={{ background: 'linear-gradient(135deg, #a8edea, #fed6e3)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🖨️</div>
            <h3 style={{ color: '#333' }}>Print Table Bill</h3>
            <p style={{ color: '#666' }}>Download table booking invoice</p>
          </Link>
        </div>
      </div>
    </div>
  );
}