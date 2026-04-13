import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function ReceptionistProfile({ user, setUser }) {
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
      setMessage({ type: "error", text: "Failed to load profile" });
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/profile/${user._id}`, {
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
      setMessage({ type: "error", text: "Failed to update profile" });
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    // Validation
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
      maxWidth: '900px',
      margin: '40px auto',
      padding: '30px',
      background: 'var(--bg-card)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      animation: 'fadeInUp 0.5s ease'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>👔</div>
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#dc3c3c',
          fontFamily: 'Playfair Display, serif',
          marginBottom: '5px'
        }}>
          Receptionist Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account information and security</p>
      </div>

      {/* Theme Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <ThemeToggle />
      </div>

      {/* Message Alert */}
      {message && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: message.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          animation: 'slideDown 0.3s ease'
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{
          borderLeft: '4px solid #dc3c3c',
          paddingLeft: '15px',
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          📋 Personal Information
        </h3>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Full Name */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              Full Name *
            </label>
            {editMode ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            ) : (
              <div style={{
                padding: '12px 15px',
                background: 'var(--bg-glass)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{profile.name || "Not set"}</span>
                {!editMode && (
                  <span style={{ fontSize: '12px', color: '#28a745' }}>✓ Verified</span>
                )}
              </div>
            )}
          </div>

          {/* Email (Read Only) */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <div style={{
              padding: '12px 15px',
              background: 'var(--bg-glass)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{profile.email}</span>
              <span style={{ fontSize: '12px', color: '#6c757d' }}>Cannot be changed</span>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              Phone Number
            </label>
            {editMode ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter phone number"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            ) : (
              <div style={{
                padding: '12px 15px',
                background: 'var(--bg-glass)',
                borderRadius: '10px',
                color: 'var(--text-primary)'
              }}>
                {profile.phone || "📱 Not provided"}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              Address
            </label>
            {editMode ? (
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Enter your address"
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  resize: 'vertical'
                }}
              />
            ) : (
              <div style={{
                padding: '12px 15px',
                background: 'var(--bg-glass)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                minHeight: '80px'
              }}>
                {profile.address || "📍 Not provided"}
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              Role
            </label>
            <div style={{
              padding: '12px 15px',
              background: 'linear-gradient(135deg, #17a2b8, #138496)',
              borderRadius: '10px',
              color: 'white',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              👔 {profile.role || "Receptionist"}
            </div>
          </div>

          {/* Join Date */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              Member Since
            </label>
            <div style={{
              padding: '12px 15px',
              background: 'var(--bg-glass)',
              borderRadius: '10px',
              color: 'var(--text-primary)'
            }}>
              📅 {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : "N/A"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          {!editMode ? (
            <>
              <button
                onClick={() => setEditMode(true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #17a2b8, #138496)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ffc107, #e0a800)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
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
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease'
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
                  background: 'linear-gradient(135deg, #6c757d, #5a6268)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
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
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '35px',
            borderRadius: '20px',
            maxWidth: '450px',
            width: '90%',
            animation: 'scaleIn 0.3s ease'
          }}>
            <h3 style={{
              color: '#dc3c3c',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>
              🔒 Change Password
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-secondary)',
                fontWeight: '500'
              }}>
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-secondary)',
                fontWeight: '500'
              }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
              <small style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
                Password must be at least 6 characters
              </small>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-secondary)',
                fontWeight: '500'
              }}>
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
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
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? "Updating..." : "✅ Update Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #6c757d, #5a6268)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => navigate("/receptionist")}
          style={{
            padding: '10px 25px',
            background: 'transparent',
            border: '2px solid #17a2b8',
            color: '#17a2b8',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#17a2b8';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#17a2b8';
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <style>{`
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #17a2b8 !important;
          box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.1);
        }
      `}</style>
    </div>
  );
}