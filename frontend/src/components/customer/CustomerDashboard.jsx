import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function CustomerDashboard() {
  return (
    <div className="customer-dashboard" style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Header with Dark Overlay for Better Text Visibility */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5))',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '20px' 
        }}>
          <h1 style={{ fontSize: '2.5rem', color: '#ffffff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            🏨 Welcome to Grand Hotel
          </h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <ThemeToggle />
            <Link 
              to="/login" 
              style={{ 
                padding: '10px 20px', 
                background: 'linear-gradient(135deg, #dc3c3c, #b83232)', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '25px', 
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Staff Login
            </Link>
          </div>
        </div>
        <p style={{ color: '#f0f0f0', fontSize: '1.1rem', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Experience luxury and comfort at its finest
        </p>
      </div>
      
      {/* Services Section */}
      <div className="customer-services">
        
        {/* Booking Services */}
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#ffffff',
          fontSize: '1.8rem',
          borderBottom: '2px solid #dc3c3c',
          display: 'inline-block',
          width: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(0,0,0,0.4)',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '10px'
        }}>
          📋 Booking Services
        </h2>
        <div className="service-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          marginBottom: '50px' 
        }}>
          <Link to="/customer/booking" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(102,126,234,0.9), rgba(118,75,162,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>📅</div>
            <h3 style={{ color: '#ffffff', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Book a Room</h3>
            <p style={{ color: '#f0f0f0' }}>Luxury rooms with stunning views</p>
          </Link>
          
          <Link to="/customer/table" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(240,147,251,0.9), rgba(245,87,108,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: '#ffffff', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Book a Table</h3>
            <p style={{ color: '#f0f0f0' }}>Reserve your dining experience</p>
          </Link>
        </div>

        {/* Food Ordering Services */}
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#ffffff',
          fontSize: '1.8rem',
          borderBottom: '2px solid #dc3c3c',
          display: 'inline-block',
          width: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(0,0,0,0.4)',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '10px'
        }}>
          🍕 Food Ordering
        </h2>
        <div className="service-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          marginBottom: '50px' 
        }}>
          <Link to="/customer/food" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(17,153,142,0.9), rgba(56,239,125,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🏠</div>
            <h3 style={{ color: '#ffffff', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Order Food (Room)</h3>
            <p style={{ color: '#f0f0f0' }}>Delivered to your room</p>
          </Link>
          
          <Link to="/customer/table-food" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(242,153,74,0.9), rgba(242,201,76,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 style={{ color: '#ffffff', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Order Food (Table)</h3>
            <p style={{ color: '#f0f0f0' }}>Order from your table</p>
          </Link>
        </div>

        {/* Room Services */}
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#ffffff',
          fontSize: '1.8rem',
          borderBottom: '2px solid #dc3c3c',
          display: 'inline-block',
          width: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(0,0,0,0.4)',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '10px'
        }}>
          🏠 Room Services
        </h2>
        <div className="service-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          marginBottom: '50px' 
        }}>
          <Link to="/customer/room-payment" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(79,172,254,0.9), rgba(0,242,254,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>💰</div>
            <h3 style={{ color: '#ffffff', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Pay Room Bill</h3>
            <p style={{ color: '#f0f0f0' }}>Pay for room stay + food orders</p>
          </Link>
          
          <Link to="/customer/print-room-bill" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(250,112,154,0.9), rgba(254,225,64,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🖨️</div>
            <h3 style={{ color: '#ffffff', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Print Room Bill</h3>
            <p style={{ color: '#f0f0f0' }}>Download room + food invoice</p>
          </Link>
        </div>

        {/* Table Services */}
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#ffffff',
          fontSize: '1.8rem',
          borderBottom: '2px solid #dc3c3c',
          display: 'inline-block',
          width: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(0,0,0,0.4)',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '10px'
        }}>
          🍽️ Table Services
        </h2>
        <div className="service-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          marginBottom: '50px' 
        }}>
          <Link to="/customer/table-payment" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(67,233,123,0.9), rgba(56,249,215,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>💰</div>
            <h3 style={{ color: '#ffffff', marginTop: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Pay Table Bill</h3>
            <p style={{ color: '#f0f0f0' }}>Pay for table booking + orders</p>
          </Link>
          
          <Link to="/customer/print-table-bill" className="service-card" style={{ 
            background: 'linear-gradient(135deg, rgba(168,237,234,0.9), rgba(254,214,227,0.9))', 
            padding: '30px', 
            borderRadius: '15px', 
            textDecoration: 'none', 
            textAlign: 'center', 
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="icon" style={{ fontSize: '3rem' }}>🖨️</div>
            <h3 style={{ color: '#333', marginTop: '15px', textShadow: 'none' }}>Print Table Bill</h3>
            <p style={{ color: '#555' }}>Download table booking invoice</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px', 
        borderTop: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '10px',
        color: '#f0f0f0',
        fontSize: '14px'
      }}>
        <p>© 2024 Grand Hotel Management System | All rights reserved</p>
        <p style={{ marginTop: '5px' }}>📍 123 Luxury Avenue, Downtown City | 📞 +91 1234567890</p>
      </div>

      <style>{`
        .service-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .customer-dashboard {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}