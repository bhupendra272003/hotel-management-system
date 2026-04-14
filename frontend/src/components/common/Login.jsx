import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

// Direct API URL - no environment variable needed
const API_URL = 'https://hotelmna.onrender.com/api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Attempting login to:", `${API_URL}/auth/login`);
      console.log("With credentials:", { email });
      
      const res = await axios.post(`${API_URL}/auth/login`, { 
        email, 
        password 
      });
      
      console.log("Login response:", res.data);
      
      if (res.data.success) {
        localStorage.setItem("token", "loggedin");
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("userName", res.data.user.name);
        
        setUser(res.data.user);
        
        if (res.data.role === "admin") {
          navigate("/admin");
        } else if (res.data.role === "receptionist") {
          navigate("/receptionist");
        } else if (res.data.role === "waiter") {
          navigate("/waiter");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res.data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error details:", error);
      console.error("Error response:", error.response);
      setError(`Login failed: ${error.response?.data?.message || error.message || "Please try again"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--bg-primary)',
      padding: '20px'
    }}>
      <div className="login-card" style={{
        maxWidth: '450px',
        width: '100%',
        background: 'var(--bg-card)',
        borderRadius: '25px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🏨</div>
          <h1 style={{ fontSize: '1.8rem', color: '#dc3c3c', marginBottom: '5px' }}>Grand Hotel</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Staff Login Portal</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <ThemeToggle />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>📧 Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login()}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                background: 'var(--bg-glass)',
                color: 'var(--text-primary)',
                fontSize: '15px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>🔒 Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login()}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                background: 'var(--bg-glass)',
                color: 'var(--text-primary)',
                fontSize: '15px'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: '#f8d7da',
              color: '#721c24',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '20px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #dc3c3c, #b83232)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Logging in..." : "🔐 Login"}
          </button>
        </div>

        <div style={{ marginTop: '25px', padding: '20px', background: 'var(--bg-glass)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '15px', color: '#dc3c3c', fontSize: '0.9rem' }}>📋 Demo Credentials</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--bg-card)', borderRadius: '10px' }}>
              <div><span style={{ fontWeight: 'bold', color: '#667eea' }}>👑 Admin</span></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px' }}>admin@hotel.com</div><div style={{ fontSize: '12px', color: '#dc3c3c' }}>admin123</div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--bg-card)', borderRadius: '10px' }}>
              <div><span style={{ fontWeight: 'bold', color: '#17a2b8' }}>👔 Receptionist</span></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px' }}>reception@hotel.com</div><div style={{ fontSize: '12px', color: '#17a2b8' }}>recep123</div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--bg-card)', borderRadius: '10px' }}>
              <div><span style={{ fontWeight: 'bold', color: '#28a745' }}>🍽️ Waiter</span></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px' }}>waiter@hotel.com</div><div style={{ fontSize: '12px', color: '#28a745' }}>waiter123</div></div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => navigate("/")} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', padding: '8px' }}>← Back to Customer Portal</button>
        </div>
      </div>
    </div>
  );
}
