import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import API_URL from "../../api/config";

export default function UserProfile({ user, setUser }) {
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", address: "", salary: "", joinDate: "", role: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/profile/${user._id}`);
      setProfile(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile" });
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile/${user._id}`, {
        name: profile.name, phone: profile.phone, address: profile.address
      });
      if (response.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setEditMode(false);
        setUser({ ...user, name: profile.name });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: "error", text: "Please enter current password" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/auth/change-password/${user._id}`, {
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
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '30px', background: 'var(--bg-card)', borderRadius: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '4rem' }}>👤</div>
        <h1 style={{ fontSize: '2rem', color: '#dc3c3c' }}>My Profile</h1>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <ThemeToggle />
      </div>
      
      {message && <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>{message.text}</div>}
      
      <div>
        <h3>📋 Personal Information</h3>
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          <div><label>Full Name</label>{editMode ? <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border-color)' }} /> : <div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '8px' }}>{profile.name}</div>}</div>
          <div><label>Email</label><div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '8px' }}>{profile.email}</div></div>
          <div><label>Phone</label>{editMode ? <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border-color)' }} /> : <div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '8px' }}>{profile.phone || "Not provided"}</div>}</div>
          <div><label>Address</label>{editMode ? <textarea value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border-color)' }} /> : <div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '8px' }}>{profile.address || "Not provided"}</div>}</div>
          <div><label>Role</label><div style={{ padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '8px', color: 'white' }}>{profile.role}</div></div>
          <div><label>Member Since</label><div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '8px' }}>{new Date(profile.joinDate).toLocaleDateString()}</div></div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          {!editMode ? (
            <>
              <button onClick={() => setEditMode(true)} style={{ flex: 1, padding: '12px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✏️ Edit Profile</button>
              <button onClick={() => setShowPasswordModal(true)} style={{ flex: 1, padding: '12px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🔒 Change Password</button>
            </>
          ) : (
            <>
              <button onClick={handleUpdateProfile} disabled={loading} style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loading ? "Saving..." : "💾 Save"}</button>
              <button onClick={() => { setEditMode(false); fetchProfile(); }} style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </>
          )}
        </div>
      </div>
      
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', maxWidth: '450px', width: '90%' }}>
            <h3>Change Password</h3>
            <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="password" placeholder="New Password (min 6 characters)" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="password" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={handleChangePassword} style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Update</button>
              <button onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      <button onClick={() => navigate(-1)} style={{ display: 'block', margin: '20px auto', padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
    </div>
  );
}
