import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

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
    if (user && user._id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/profile/${user._id}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/profile/${user._id}`, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        salary: profile.salary
      });
      
      if (response.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setEditMode(false);
        setUser({ ...user, name: profile.name });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/change-password/${user._id}`, {
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
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to change password" });
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '30px',
      background: 'var(--bg-card)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '4rem' }}>👤</div>
        <h2 style={{ color: '#dc3c3c', marginTop: '10px' }}>My Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account information</p>
      </div>
      
      {message && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '8px',
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
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', borderLeft: '4px solid #dc3c3c', paddingLeft: '15px' }}>
          Personal Information
        </h3>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Full Name
            </label>
            {editMode ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)'
                }}
              />
            ) : (
              <p style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', color: 'var(--text-primary)' }}>
                {profile.name}
              </p>
            )}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Email Address
            </label>
            <p style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', color: 'var(--text-primary)' }}>
              {profile.email}
            </p>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Phone Number
            </label>
            {editMode ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)'
                }}
              />
            ) : (
              <p style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', color: 'var(--text-primary)' }}>
                {profile.phone || "Not provided"}
              </p>
            )}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Address
            </label>
            {editMode ? (
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)'
                }}
              />
            ) : (
              <p style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', color: 'var(--text-primary)' }}>
                {profile.address || "Not provided"}
              </p>
            )}
          </div>
          
          {profile.role === "admin" && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Salary
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={profile.salary}
                  onChange={(e) => setProfile({ ...profile, salary: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'var(--bg-glass)',
                    color: 'var(--text-primary)'
                  }}
                />
              ) : (
                <p style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', color: 'var(--text-primary)' }}>
                  ₹{profile.salary?.toLocaleString() || "0"}
                </p>
              )}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Role
            </label>
            <p style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', color: '#dc3c3c', fontWeight: '600', textTransform: 'capitalize' }}>
              {profile.role}
            </p>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Member Since
            </label>
            <p style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', color: 'var(--text-primary)' }}>
              {new Date(profile.joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
          {!editMode ? (
            <>
              <button
                onClick={() => setEditMode(true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#dc3c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🔒 Change Password
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  fetchProfile();
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '30px',
            borderRadius: '20px',
            maxWidth: '450px',
            width: '90%'
          }}>
            <h3 style={{ color: '#dc3c3c', marginBottom: '20px', textAlign: 'center' }}>
              Change Password
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {loading ? "Processing..." : "Update Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => {
            if (profile.role === "admin") navigate("/admin");
            else if (profile.role === "receptionist") navigate("/receptionist");
            else navigate("/");
          }}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '2px solid #dc3c3c',
            color: '#dc3c3c',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
