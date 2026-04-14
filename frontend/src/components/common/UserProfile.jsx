import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function UserProfile({ user, setUser }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    salary: "",
    joinDate: "",
    role: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User object:", user);
    if (user && user._id) {
      fetchProfile();
    } else {
      console.error("No user ID found. User object:", user);
      setMessage({ type: "error", text: "User not logged in. Please login again." });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile for user ID:", user._id);
      console.log("API URL:", `${API_URL}/auth/profile/${user._id}`);
      
      const response = await axios.get(`${API_URL}/auth/profile/${user._id}`);
      console.log("Profile response:", response.data);
      
      setProfile(response.data);
      setMessage({ type: "success", text: "Profile loaded successfully!" });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error("Error fetching profile:", error);
      console.error("Error details:", error.response?.data);
      
      if (error.response?.status === 404) {
        setMessage({ type: "error", text: "User not found. Please contact support." });
      } else if (error.response?.status === 401) {
        setMessage({ type: "error", text: "Unauthorized. Please login again." });
        navigate("/login");
      } else {
        setMessage({ type: "error", text: error.response?.data?.error || "Failed to load profile" });
      }
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/auth/profile/${user._id}`, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });
      
      if (response.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setEditMode(false);
        setUser({ ...user, name: profile.name });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to update profile" });
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: "error", text: "Please enter current password" });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/auth/change-password/${user._id}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Password error:", error);
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to change password" });
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  };

  // If no user is logged in, show login prompt
  if (!user || !user._id) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please login to view profile</h2>
        <button onClick={() => navigate("/login")} style={{ padding: '10px 20px', background: '#dc3c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      padding: '30px',
      background: 'var(--bg-card)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>👤</div>
        <h1 style={{ fontSize: '2rem', color: '#dc3c3c', marginBottom: '5px' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account information and security</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <ThemeToggle />
      </div>

      {message && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: message.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ borderLeft: '4px solid #dc3c3c', paddingLeft: '15px', marginBottom: '20px' }}>📋 Personal Information</h3>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Full Name</label>
            {editMode ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--border-color)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
              />
            ) : (
              <div style={{ padding: '12px 15px', background: 'var(--bg-glass)', borderRadius: '10px' }}>{profile.name || "Not set"}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Email Address</label>
            <div style={{ padding: '12px 15px', background: 'var(--bg-glass)', borderRadius: '10px' }}>{profile.email}</div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Phone Number</label>
            {editMode ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--border-color)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
              />
            ) : (
              <div style={{ padding: '12px 15px', background: 'var(--bg-glass)', borderRadius: '10px' }}>{profile.phone || "Not provided"}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Address</label>
            {editMode ? (
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows="3"
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--border-color)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
              />
            ) : (
              <div style={{ padding: '12px 15px', background: 'var(--bg-glass)', borderRadius: '10px', minHeight: '80px' }}>{profile.address || "Not provided"}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Role</label>
            <div style={{ padding: '12px 15px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '10px', color: 'white', fontWeight: '600', textTransform: 'capitalize' }}>{profile.role || "User"}</div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Member Since</label>
            <div style={{ padding: '12px 15px', background: 'var(--bg-glass)', borderRadius: '10px' }}>
              {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          {!editMode ? (
            <>
              <button onClick={() => setEditMode(true)} style={{ flex: 1, padding: '12px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>✏️ Edit Profile</button>
              <button onClick={() => setShowPasswordModal(true)} style={{ flex: 1, padding: '12px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>🔒 Change Password</button>
            </>
          ) : (
            <>
              <button onClick={handleUpdateProfile} disabled={loading} style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>{loading ? "Saving..." : "💾 Save Changes"}</button>
              <button onClick={() => { setEditMode(false); fetchProfile(); }} style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>❌ Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', maxWidth: '450px', width: '90%' }}>
            <h3 style={{ color: '#dc3c3c', marginBottom: '20px', textAlign: 'center' }}>Change Password</h3>
            <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="password" placeholder="New Password (min 6 characters)" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={handleChangePassword} style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Update Password</button>
              <button onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => navigate(-1)} style={{ display: 'block', margin: '20px auto', padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
    </div>
  );
}
