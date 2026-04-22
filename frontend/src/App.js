import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './contexts/AuthContext';

// Customer Components
import CustomerDashboard from "./components/customer/CustomerDashboard";
import CustomerBooking from "./components/customer/CustomerBooking";
import CustomerFoodOrder from "./components/customer/CustomerFoodOrder";
import CustomerTableBooking from "./components/customer/CustomerTableBooking";
import CustomerBilling from "./components/customer/CustomerBilling";
import CustomerFoodPayment from "./components/customer/CustomerFoodPayment";
import CustomerTablePayment from "./components/customer/CustomerTablePayment";
import PrintTableBill from "./components/customer/PrintTableBill";
import PrintRoomBill from "./components/customer/PrintRoomBill";
import CustomerTableFoodOrder from "./components/customer/CustomerTableFoodOrder";
import RoomPayment from "./components/customer/RoomPayment";

// Staff Components
import Login from "./components/common/Login";
import UserProfile from "./components/common/UserProfile";

// Receptionist Components
import ReceptionistDashboard from "./components/receptionist/ReceptionistDashboard";
import ReceptionistProfile from "./components/receptionist/ReceptionistProfile";
import RoomBooking from "./components/receptionist/RoomBooking";
import CheckInOut from "./components/receptionist/CheckInOut";
import ConfirmOrders from "./components/receptionist/ConfirmOrders";
import ConfirmTables from "./components/receptionist/ConfirmTables";
import ManageTables from "./components/receptionist/ManageTables";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import HotelStats from "./components/admin/HotelStats";
import ManageStaff from "./components/admin/ManageStaff";
import AssignTasks from "./components/admin/AssignTasks";
import ViewReports from "./components/admin/ViewReports";
import BillManagement from "./components/admin/BillManagement";
import TaskDistribution from "./components/admin/TaskDistribution";

// Waiter Components
import WaiterDashboard from "./components/waiter/WaiterDashboard";
import WaiterProfile from "./components/waiter/WaiterProfile";

// Theme Effect Components
import SunsetBackground from "./components/SunsetBackground";
import RainEffect from "./components/RainEffect";

function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };
    
    window.addEventListener('themechange', handleThemeChange);
    handleThemeChange();
    
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole");
    const savedUserId = localStorage.getItem("userId");
    
    if (savedUser && savedRole && savedUserId) {
      setUser({
        name: savedUser,
        role: savedRole,
        _id: savedUserId
      });
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {isDarkMode ? <RainEffect /> : <SunsetBackground />}
      <AuthProvider>
        <BrowserRouter>
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Customer Routes */}
              <Route path="/" element={<CustomerDashboard />} />
              <Route path="/customer/booking" element={<CustomerBooking />} />
              <Route path="/customer/food" element={<CustomerFoodOrder />} />
              <Route path="/customer/table" element={<CustomerTableBooking />} />
              <Route path="/customer/table-food" element={<CustomerTableFoodOrder />} />
              <Route path="/customer/billing" element={<CustomerBilling />} />
              <Route path="/customer/food-payment" element={<CustomerFoodPayment />} />
              <Route path="/customer/table-payment" element={<CustomerTablePayment />} />
              <Route path="/customer/room-payment" element={<RoomPayment />} />
              <Route path="/customer/print-table-bill" element={<PrintTableBill />} />
              <Route path="/customer/print-room-bill" element={<PrintRoomBill />} />
              
              {/* Login & Profile */}
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/profile" element={<UserProfile user={user} setUser={setUser} />} />
              
              {/* Receptionist Routes */}
              <Route path="/receptionist" element={<ReceptionistDashboard user={user} />} />
              <Route path="/receptionist/profile" element={<ReceptionistProfile user={user} setUser={setUser} />} />
              <Route path="/receptionist/booking" element={<RoomBooking />} />
              <Route path="/receptionist/checkinout" element={<CheckInOut />} />
              <Route path="/receptionist/confirm-orders" element={<ConfirmOrders />} />
              <Route path="/receptionist/confirm-tables" element={<ConfirmTables />} />
              <Route path="/receptionist/tables" element={<ManageTables />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard user={user} />} />
              <Route path="/admin/stats" element={<HotelStats />} />
              <Route path="/admin/staff" element={<ManageStaff />} />
              <Route path="/admin/tasks" element={<AssignTasks />} />
              <Route path="/admin/reports" element={<ViewReports />} />
              <Route path="/admin/bills" element={<BillManagement />} />
              <Route path="/admin/task-distribution" element={<TaskDistribution />} />
              
              {/* Waiter Routes */}
              <Route path="/waiter" element={<WaiterDashboard user={user} />} />
              <Route path="/waiter/profile" element={<WaiterProfile user={user} setUser={setUser} />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;