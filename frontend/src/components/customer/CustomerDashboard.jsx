import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function CustomerDashboard() {
  return (
    <div className="customer-dashboard" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#ff0000' }}>🏨 Welcome to Grand Hotel</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <ThemeToggle />
            <Link to="/login" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #dc3c3c, #b83232)', color: 'white', textDecoration: 'none', borderRadius: '25px', fontWeight: '600' }}>Staff Login</Link>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '15px' }}>Experience luxury and comfort at its finest</p>
      </div>
      
      <div className="customer-services">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Our Premium Services</h2>
        
        {/* Booking Services */}
        <h3 style={{ marginBottom: '15px', color: '#0011ff' }}>📋 Bookings</h3>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <Link to="/customer/booking" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>📅</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Book a Room</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Luxury rooms with stunning views</p>
          </Link>
          
          <Link to="/customer/table" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Book a Table</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Reserve your dining experience</p>
          </Link>
        </div>

        {/* Food Ordering Services */}
        <h3 style={{ marginBottom: '15px', color: '#d9ff00' }}>🍕 Food Ordering</h3>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <Link to="/customer/food" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🏠</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Order Food (Room)</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Delivered to your room</p>
          </Link>
          
          <Link to="/customer/table-food" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Order Food (Table)</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Order from your table</p>
          </Link>
        </div>

        {/* Payment Services */}
        <h3 style={{ marginBottom: '15px', color: '#0400ff' }}>💰 Payments</h3>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <Link to="/customer/room-payment" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🏠</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Pay Room Bill</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Pay for your room stay</p>
          </Link>
          
          <Link to="/customer/table-payment" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Pay Table Bill</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Pay for table booking</p>
          </Link>
        </div>

        {/* Print Bill Services */}
        <h3 style={{ marginBottom: '15px', color: '#ff0000' }}>🖨️ Print Bill</h3>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <Link to="/customer/print-room-bill" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🏠</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Print Room Bill</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Download room + food invoice</p>
          </Link>
          
          <Link to="/customer/print-table-bill" className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '15px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s ease' }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Print Table Bill</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Download table booking invoice</p>
          </Link>
        </div>
      </div>
    </div>
  );
}