import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import API_URL from "../../api/config";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const navigate = useNavigate();

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      // Increased timeout for free tier wake-up
      await axios.get(`${API_URL}/test`, { timeout: 60000 });
      setBackendStatus("connected");
      console.log("✅ Backend connected at:", API_URL);
    } catch (error) {
      console.error("❌ Backend connection failed:", error);
      setBackendStatus("disconnected");
      // Don't show error immediately - backend might be waking up
      setTimeout(() => {
        if (backendStatus === "disconnected") {
          setError("⏳ Backend is waking up from sleep mode. Please wait 30 seconds and try again.");
        }
      }, 5000);
    }
  };

  const login = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    // Retry logic for waking up backend
    let retries = 3;
    let success = false;
    
    while (retries > 0 && !success) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { timeout: 60000 });
        
        if (res.data.success) {
          success = true;
          localStorage.setItem("token", "loggedin");
          localStorage.setItem("userRole", res.data.role);
          localStorage.setItem("userId", res.data.user._id);
          localStorage.setItem("userName", res.data.user.name);
          setUser(res.data.user);
          
          if (res.data.role === "admin") navigate("/admin");
          else if (res.data.role === "receptionist") navigate("/receptionist");
          else if (res.data.role === "waiter") navigate("/waiter");
          else navigate("/dashboard");
        } else {
          setError(res.data.message || "Invalid credentials!");
          success = true;
        }
      } catch (error) {
        retries--;
        if (retries === 0) {
          setError("Unable to connect to backend. Please ensure the server is running.");
        } else {
          setError(`Attempting to connect... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'var(--bg-primary)', padding: '20px'
    }}>
      <div className="login-card" style={{
        maxWidth: '450px', width: '100%', background: 'var(--bg-card)', borderRadius: '25px',
        padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🏨</div>
          <h1 style={{ fontSize: '1.8rem', color: '#dc3c3c', marginBottom: '5px' }}>Grand Hotel</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Staff Login Portal</p>
          {backendStatus === "connected" && <p style={{ fontSize: '12px', color: '#28a745', marginTop: '10px' }}>✅ Backend connected</p>}
          {backendStatus === "disconnected" && <p style={{ fontSize: '12px', color: '#ffc107', marginTop: '10px' }}>⏳ Connecting to backend...</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <ThemeToggle />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>📧 Email Address</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login()}
              style={{ width: '100%', padding: '14px 16px', border: '2px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-glass)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>🔒 Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login()}
              style={{ width: '100%', padding: '14px 16px', border: '2px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-glass)', color: 'var(--text-primary)' }} />
          </div>

          {error && <div style={{ padding: '12px', borderRadius: '10px', background: '#f8d7da', color: '#721c24', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

          <button onClick={login} disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #dc3c3c, #b83232)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? "Logging in..." : "🔐 Login"}
          </button>
        </div>

        <div style={{ marginTop: '25px', padding: '20px', background: 'var(--bg-glass)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '15px', color: '#dc3c3c' }}>📋 Demo Credentials</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--bg-card)', borderRadius: '10px' }}>
              <div><span style={{ fontWeight: 'bold', color: '#667eea' }}>👑 Admin</span></div>
              <div style={{ textAlign: 'right' }}>admin@hotel.com / admin123</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--bg-card)', borderRadius: '10px' }}>
              <div><span style={{ fontWeight: 'bold', color: '#17a2b8' }}>👔 Receptionist</span></div>
              <div style={{ textAlign: 'right' }}>reception@hotel.com / recep123</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--bg-card)', borderRadius: '10px' }}>
              <div><span style={{ fontWeight: 'bold', color: '#28a745' }}>🍽️ Waiter</span></div>
              <div style={{ textAlign: 'right' }}>waiter@hotel.com / waiter123</div>
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