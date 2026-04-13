import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, role }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const getNavLinks = () => {
    switch(role) {
      case "admin":
        return (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/stats">Statistics</Link>
            <Link to="/admin/staff">Manage Staff</Link>
            <Link to="/admin/tasks">Tasks</Link>
            <Link to="/admin/reports">Reports</Link>
          </>
        );
      case "receptionist":
        return (
          <>
            <Link to="/receptionist">Dashboard</Link>
            <Link to="/receptionist/booking">New Booking</Link>
            <Link to="/receptionist/checkinout">Check In/Out</Link>
            <Link to="/receptionist/confirm-orders">Food Orders</Link>
            <Link to="/receptionist/confirm-tables">Table Bookings</Link>
          </>
        );
      default:
        return (
          <>
            <Link to="/">Home</Link>
            <Link to="/customer/booking">Book Room</Link>
            <Link to="/customer/food">Order Food</Link>
            <Link to="/customer/table">Book Table</Link>
            <Link to="/customer/billing">Bill/Pay</Link>
          </>
        );
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={role ? `/${role}` : "/"}>🏨 Grand Hotel</Link>
      </div>
      <div className="nav-links">
        {getNavLinks()}
        {user ? (
          <>
            <span className="user-name">👤 {user.name}</span>
            <button onClick={logout} className="nav-logout">Logout</button>
          </>
        ) : (
          <Link to="/login" className="staff-login-btn">Staff Login</Link>
        )}
      </div>
    </nav>
  );
}