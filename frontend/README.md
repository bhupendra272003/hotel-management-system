```markdown
# 🏨 Grand Hotel Management System - Professional Edition

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Node](https://img.shields.io/badge/Node-14+-339933.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Installation Guide](#installation-guide)
- [User Roles & Credentials](#user-roles--credentials)
- [Feature Breakdown](#feature-breakdown)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Payment System](#payment-system)
- [Task Assignment System](#task-assignment-system)
- [Theme System](#theme-system)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## 🎯 Overview

**Grand Hotel Management System** is a comprehensive, full-stack web application designed to streamline hotel operations including room bookings, table reservations, food ordering, billing, and staff management. The system features three distinct user roles (Admin, Receptionist, Waiter) and provides a seamless experience for both staff and customers.

### Key Highlights

| Feature | Description |
|---------|-------------|
| 🏨 **Complete Hotel Management** | Rooms, Tables, Food Orders, Billing |
| 👥 **Multi-role System** | Admin, Receptionist, Waiter with different permissions |
| 💳 **Secure Payment Processing** | Cash, Card, UPI with transaction tracking |
| 📊 **Real-time Analytics** | Revenue tracking, occupancy rates, business metrics |
| 🎨 **Modern UI/UX** | Responsive design, theme toggle (Light/Dark mode) |
| 🔐 **Secure Authentication** | Role-based access control |
| 📱 **Mobile Responsive** | Works on all devices |
| 🔄 **Task Distribution** | Equal task assignment among waiters |

---

## ✨ Features

### 👑 Admin Features
- 📊 **Dashboard Analytics** - Real-time revenue, bookings, occupancy statistics
- 👥 **Staff Management** - Add, edit, delete staff members (Receptionists, Waiters)
- ✅ **Task Assignment** - Assign and track tasks with equal distribution algorithm
- 📈 **Report Generation** - Export bills, transaction history, performance metrics
- 💰 **Bill Management** - View, filter, mark paid, delete all bills
- 🪑 **Table Management** - Monitor table status (available/booked/occupied)
- 📊 **Task Distribution View** - See task allocation across all staff members

### 👔 Receptionist Features
- 📅 **Room Booking** - Create and manage room reservations
- ✅ **Check-in/Check-out** - Manage guest check-ins and check-outs
- 🍕 **Order Confirmation** - Confirm and track food orders
- 🍽️ **Table Booking Confirmation** - Confirm table reservations
- 📋 **Manage Tables** - Mark tables as occupied/free
- 📊 **View All Bookings** - Track all room and table bookings

### 🍽️ Waiter Features
- 📋 **Task Dashboard** - View assigned tasks (food delivery, room cleaning, table setup)
- ✅ **Task Management** - Update task status (pending → in-progress → completed)
- 📝 **Task Notes** - Add notes and updates to tasks
- 🎯 **Priority Tasks** - View urgent and high-priority tasks
- 📊 **Personal Statistics** - Track completed tasks and performance

### 👤 Customer Features (No Login Required)
- 📅 **Room Booking** - Book rooms with advance payment
- 🍕 **Food Ordering** - Order food for room delivery or dine-in
- 🍽️ **Table Booking** - Reserve tables with advance payment
- 💳 **Payment Processing** - Pay bills via Cash, Card, or UPI
- 🧾 **Print Bill** - Download/print detailed invoices
- 📊 **View Bill Status** - Check paid/unpaid status
- 🔍 **Search Bookings** - Find bookings by email or phone

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2.0 | UI Framework |
| React Router DOM | 6.10.0 | Navigation & Routing |
| Axios | 1.3.4 | HTTP Client for API calls |
| CSS3 | - | Styling with animations |
| HTML5 | - | Structure |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 14+ | JavaScript Runtime |
| Express.js | 4.18.2 | Web Framework |
| MongoDB | 7.0+ | NoSQL Database |
| Mongoose | 7.0.0 | ODM for MongoDB |
| CORS | 2.8.5 | Cross-origin resource sharing |

### Development Tools
- **Nodemon** - Auto-reload during development
- **ESLint** - Code linting and formatting
- **Git** - Version control

---

## 📁 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React.js)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Customer │  │  Admin  │  │Reception│  │  Waiter │        │
│  │Dashboard│  │Dashboard│  │Dashboard│  │Dashboard│        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       └────────────┴────────────┴────────────┘              │
│                         │                                    │
│                  Axios HTTP Requests                        │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    API Routes                        │   │
│  ├──────────┬──────────┬──────────┬──────────┬────────┤   │
│  │   Auth   │  Booking │   Food   │  Table   │ Billing│   │
│  └──────────┴──────────┴──────────┴──────────┴────────┘   │
│  ┌──────────┬──────────┬──────────┐                        │
│  │ Customer │   Task   │  Staff   │                        │
│  └──────────┴──────────┴──────────┘                        │
│                         │                                   │
│                  Mongoose ODM                              │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Bookings│ │ Foods  │ │ Tables │ │ Billing│ │ Users  │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│  ┌────────┐                                                │
│  │  Tasks │                                                │
│  └────────┘                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v7.0 or higher)
- npm or yarn package manager

### One-Line Setup (Windows PowerShell)

```powershell
# Clone and setup
git clone https://github.com/yourusername/hotel-management-system.git
cd hotel-management-system
cd backend && npm install && cd ../frontend && npm install && cd ..
```

### Step-by-Step Installation

**Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/hotel-management-system.git
cd hotel-management-system
```

**Step 2: Install Backend Dependencies**
```bash
cd backend
npm install
```

**Step 3: Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

**Step 4: Start MongoDB**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
# OR
mongod --dbpath /data/db
```

**Step 5: Run the Application**

*Terminal 1 - Backend:*
```bash
cd backend
npm start
# OR with auto-reload
npm run dev
```

*Terminal 2 - Frontend:*
```bash
cd frontend
npm start
```

**Step 6: Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Test: http://localhost:5000/api/test

---

## 👥 User Roles & Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@hotel.com | admin123 | Full system access, staff management, reports |
| **Receptionist** | reception@hotel.com | recep123 | Room booking, check-in/out, order confirmation |
| **Waiter** | waiter@hotel.com | waiter123 | Task management, order serving |

### Access Matrix

| Feature | Admin | Receptionist | Waiter | Customer |
|---------|-------|--------------|--------|----------|
| Room Booking | ✅ | ✅ | ❌ | ✅ |
| Check-in/out | ✅ | ✅ | ❌ | ❌ |
| Food Ordering | ✅ | ✅ | ❌ | ✅ |
| Table Booking | ✅ | ✅ | ❌ | ✅ |
| Confirm Orders | ✅ | ✅ | ❌ | ❌ |
| Manage Staff | ✅ | ❌ | ❌ | ❌ |
| View Reports | ✅ | ❌ | ❌ | ❌ |
| Bill Management | ✅ | ❌ | ❌ | ❌ |
| Task Assignment | ✅ | ❌ | ❌ | ❌ |
| View Tasks | ✅ | ❌ | ✅ | ❌ |
| Profile Management | ✅ | ✅ | ✅ | ❌ |

---

## 📋 Feature Breakdown

### 👑 Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Revenue Analytics** | Real-time total revenue, collected amount, pending amount |
| **Booking Statistics** | Total bookings, active check-ins, completed stays |
| **Food Orders Stats** | Total orders, paid orders, total value |
| **Table Bookings Stats** | Total bookings, confirmed, paid, total value |
| **Staff Management** | Add, edit, delete staff members |
| **Task Distribution** | View and rebalance tasks among staff |
| **Bill Management** | View all bills, filter by type, mark paid, delete |
| **Report Generation** | Export transaction history |

### 👔 Receptionist Dashboard

| Feature | Description |
|---------|-------------|
| **Room Booking** | Create new room reservations |
| **Check-in/Out** | Process guest check-ins and check-outs |
| **Confirm Orders** | Review and confirm food orders |
| **Confirm Tables** | Review and confirm table reservations |
| **Manage Tables** | Mark tables as occupied/free |
| **View Bookings** | Track all room and table bookings |

### 🍽️ Waiter Dashboard

| Feature | Description |
|---------|-------------|
| **Task List** | View all assigned tasks |
| **Task Status** | Update task status (pending → in-progress → completed) |
| **Task Notes** | Add notes and updates to tasks |
| **Priority Indicators** | Urgent, high, medium, low priority |
| **Personal Statistics** | Track completed tasks and performance |

### 👤 Customer Portal

| Feature | Description |
|---------|-------------|
| **Room Booking** | Book rooms with room type selection |
| **Food Ordering** | Order food for room delivery or dine-in |
| **Table Booking** | Reserve tables with table number selection |
| **Payment Processing** | Pay via Cash, Card, or UPI |
| **Bill Printing** | Download/print detailed invoices |
| **Payment Status** | Check paid/unpaid status |

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/login` | User login | `{ email, password }` |
| POST | `/api/auth/register` | Register staff (admin) | `{ name, email, password, role, phone, salary }` |
| GET | `/api/auth/staff` | Get all staff | - |
| PUT | `/api/auth/profile/:userId` | Update profile | `{ name, phone, address }` |
| PUT | `/api/auth/change-password/:userId` | Change password | `{ currentPassword, newPassword }` |

### Booking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/booking` | Get all bookings |
| POST | `/api/booking` | Create new booking |
| PUT | `/api/booking/checkin/:id` | Check-in guest |
| PUT | `/api/booking/checkout/:id` | Check-out guest |

### Food Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food` | Get all food orders |
| POST | `/api/food` | Create room delivery order |
| POST | `/api/food/table-order` | Create dine-in order |
| PUT | `/api/food/:id` | Update order status |
| POST | `/api/food/pay/:id` | Pay for food order |

### Table Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/table` | Get all tables |
| GET | `/api/table/:id` | Get table by ID |
| POST | `/api/table` | Book a table |
| POST | `/api/table/add-order/:tableId` | Add order to table |
| PUT | `/api/table/occupy/:id` | Mark table as occupied |
| PUT | `/api/table/free/:id` | Free table |
| PUT | `/api/table/update-order/:tableId/:orderId` | Update order status |
| DELETE | `/api/table/:id` | Delete table booking |

### Billing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing` | Get all bills |
| GET | `/api/billing/unpaid` | Get unpaid bills |
| GET | `/api/billing/paid` | Get paid bills |
| POST | `/api/billing/pay-room/:roomNo` | Pay room bill |
| POST | `/api/billing/pay-table/:bookingId` | Pay table bill |
| POST | `/api/billing/generate-combined/:roomNo` | Generate combined bill |
| POST | `/api/billing/generate-table/:bookingId` | Generate table bill |
| PUT | `/api/billing/pay/:id` | Mark bill as paid |
| DELETE | `/api/billing/:id` | Delete bill |
| GET | `/api/billing/statistics` | Get revenue statistics |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/user/:userId` | Get user tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/rebalance` | Rebalance tasks among staff |
| GET | `/api/tasks/distribution` | Get task distribution stats |

---

## 🗄️ Database Schema

### Booking Collection
```javascript
{
  name: String,
  email: String,
  aadhar: String,
  gender: String,
  age: Number,
  roomNo: String,
  roomType: String,      // Standard, Deluxe, Suite
  bedType: String,       // Single, Double, King
  people: Number,
  days: Number,
  status: String,        // Booked, CheckedIn, CheckedOut, Completed
  createdAt: Date
}
```

### Food Collection
```javascript
{
  roomNo: String,
  tableId: String,
  items: Array,
  total: Number,
  orderType: String,     // room_delivery, dine_in
  status: String,        // pending, confirmed, delivered
  paymentStatus: String, // paid, unpaid
  paymentMethod: String, // cash, card, upi
  transactionId: String,
  createdAt: Date
}
```

### Table Collection
```javascript
{
  name: String,
  email: String,
  phone: String,
  persons: Number,
  tableNumber: String,
  time: String,
  date: String,
  orders: Array,
  advanceAmount: Number,
  totalOrderAmount: Number,
  totalAmount: Number,
  bookingStatus: String,   // available, booked, occupied
  paymentStatus: String,   // unpaid, partial, paid
  paymentMethod: String,
  transactionId: String,
  createdAt: Date
}
```

### Billing Collection
```javascript
{
  roomNo: String,
  guestName: String,
  roomCharge: Number,
  foodCharge: Number,
  tableCharge: Number,
  tax: Number,
  discount: Number,
  total: Number,
  paymentStatus: String,   // paid, unpaid, partial
  paymentMethod: String,   // cash, card, upi
  transactionId: String,
  paymentDate: Date,
  billType: String,        // combined, table
  roomDetails: Object,
  foodOrders: Array,
  tableBookings: Array,
  createdAt: Date
}
```

### User Collection
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,           // admin, receptionist, waiter
  phone: String,
  address: String,
  salary: Number,
  isActive: Boolean,
  joinDate: Date,
  lastLogin: Date
}
```

### Task Collection
```javascript
{
  title: String,
  description: String,
  taskType: String,       // order_serve, room_cleaning, table_setup
  assignedTo: ObjectId,
  assignedBy: ObjectId,
  roomNo: String,
  tableId: String,
  orderId: String,
  status: String,         // pending, in-progress, completed
  priority: String,       // low, medium, high, urgent
  notes: String,
  createdAt: Date,
  completedAt: Date
}
```

---

## 💳 Payment System

### Supported Payment Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| 💵 **Cash** | Physical cash payment | At reception or delivery |
| 💳 **Card** | Credit/Debit card | Online or at reception |
| 📱 **UPI** | Google Pay, PhonePe, etc. | Online payment |

### Bill Calculation

```
Room Charge = Room Rate × Number of Days
Food Charge = Sum of all food items
Table Charge = Advance Amount + Food Orders
Subtotal = Room Charge + Food Charge + Table Charge
GST = Subtotal × 18%
Total = Subtotal + GST
```

### Transaction Flow

1. Customer initiates payment
2. System generates unique transaction ID
3. Payment method selected (Cash/Card/UPI)
4. Payment processed
5. Bill status updated to "paid"
6. Transaction recorded with timestamp
7. Invoice generated for printing

---

## 🔄 Task Assignment System

### Round-Robin Algorithm

The system distributes tasks equally among all active waiters using a round-robin algorithm:

```
Task 1 → Waiter 1
Task 2 → Waiter 2
Task 3 → Waiter 3
Task 4 → Waiter 1 (cycles back)
```

### Task Types

| Type | Description | Priority |
|------|-------------|----------|
| 🍕 Order Serving | Deliver food to rooms/tables | High |
| 🧹 Room Cleaning | Clean rooms after checkout | Medium |
| 🍽️ Table Setup | Prepare tables for guests | Medium |
| 🛏️ Linen Change | Change bed sheets and towels | Low |
| 🥤 Minibar Refill | Restock minibar items | Low |
| 🙏 Guest Request | Handle special requests | High |

### Task Status Flow

```
Pending → In Progress → Completed
   ↓           ↓            ↓
  New        Working       Done
  Task       on Task       Task
```

### Admin Controls

- View task distribution across all staff
- Manually rebalance tasks
- Set task priorities
- Track completion rates

---

## 🎨 Theme System

### Light Mode
- Professional hotel background image
- Warm gold and dark blue color scheme
- Sky blue/grey cards for contrast
- Optimal text readability
- Professional appearance

### Dark Mode
- Rainy night theme
- Dark blue gradients
- Animated rain effects
- Reduced eye strain
- Modern dark interface

### Theme Toggle
- Switch between light and dark modes
- Preference saved in localStorage
- Smooth transitions
- Consistent across all pages

---

## 📁 Project Structure

```
hotel-management-system/
│
├── backend/
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Food.js
│   │   ├── Table.js
│   │   ├── Billing.js
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── booking.js
│   │   ├── food.js
│   │   ├── table.js
│   │   ├── billing.js
│   │   ├── customer.js
│   │   └── task.js
│   ├── services/
│   │   └── taskAssigner.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── HotelStats.jsx
        │   │   ├── ManageStaff.jsx
        │   │   ├── AssignTasks.jsx
        │   │   ├── ViewReports.jsx
        │   │   ├── BillManagement.jsx
        │   │   └── TaskDistribution.jsx
        │   ├── receptionist/
        │   │   ├── ReceptionistDashboard.jsx
        │   │   ├── RoomBooking.jsx
        │   │   ├── CheckInOut.jsx
        │   │   ├── ConfirmOrders.jsx
        │   │   ├── ConfirmTables.jsx
        │   │   └── ManageTables.jsx
        │   ├── waiter/
        │   │   ├── WaiterDashboard.jsx
        │   │   └── WaiterProfile.jsx
        │   ├── customer/
        │   │   ├── CustomerDashboard.jsx
        │   │   ├── CustomerBooking.jsx
        │   │   ├── CustomerFoodOrder.jsx
        │   │   ├── CustomerTableBooking.jsx
        │   │   ├── CustomerBilling.jsx
        │   │   ├── CustomerFoodPayment.jsx
        │   │   ├── CustomerTablePayment.jsx
        │   │   ├── PrintBill.jsx
        │   │   ├── PrintRoomBill.jsx
        │   │   └── PrintTableBill.jsx
        │   └── common/
        │       ├── Login.jsx
        │       ├── UserProfile.jsx
        │       ├── Navbar.jsx
        │       └── ThemeToggle.jsx
        ├── styles/
        │   ├── theme.css
        │   ├── responsive.css
        │   └── hotel.css
        ├── App.js
        └── index.js
```

---

## ⚙️ Configuration

### Environment Variables (.env)

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/hotel

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@hotel.com
ADMIN_PASSWORD=admin123
```

### Room Configuration

| Room Type | Rate per Day |
|-----------|--------------|
| Standard | ₹1,500 |
| Deluxe | ₹3,000 |
| Suite | ₹5,000 |

### Table Configuration

- Available Tables: T01 to T10
- Advance Booking Amount: ₹500
- GST: 18%

---

## 🐛 Troubleshooting

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| MongoDB connection error | MongoDB not running | Start MongoDB: `mongod` |
| Port 5000 already in use | Another process using port | `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F` |
| Port 3000 already in use | Another React app running | Change port or kill process |
| Module not found | Dependencies not installed | Run `npm install` in both directories |
| CORS error | Backend not configured | Check CORS settings in server.js |
| Payment not updating | Cache issue | Clear browser cache and restart |
| Table booking fails | Table already booked | Choose different table |
| Task not assigning | No active waiters | Add waiters via Manage Staff |
| 404 error | Wrong API endpoint | Check API URL in axios calls |

### Debugging Commands

```bash
# Check MongoDB status
mongosh --eval "db.runCommand({ping:1})"

# Check backend logs
cd backend && npm start

# Check frontend logs
cd frontend && npm start

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check database collections
mongosh
use hotel
show collections
```

### Quick Fixes

**Windows PowerShell:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

---

## 🚢 Deployment

### Deploy to Production

#### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

#### Backend (Render)
1. Push code to GitHub repository
2. Log in to Render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables
8. Click "Deploy"

#### Backend (Heroku)
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### Docker Deployment

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: always

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/hotel
      - PORT=5000
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: always

volumes:
  mongodb_data:
```

**Run with Docker:**
```bash
docker-compose up --build
```

---

## 🗺️ Future Roadmap

### Version 2.0 (Planned)

| Feature | Status | Expected Release |
|---------|--------|------------------|
| Email Notifications | 📋 Planned | Q3 2026 |
| SMS Alerts | 📋 Planned | Q3 2026 |
| Mobile App (React Native) | 📋 Planned | Q4 2026 |
| Online Check-in | 📋 Planned | Q4 2026 |
| Loyalty Program | 📋 Planned | Q1 2027 |
| Multi-language Support | 📋 Planned | Q1 2027 |
| Export Reports (PDF/Excel) | 📋 Planned | Q2 2027 |
| Real-time WebSocket Updates | 📋 Planned | Q2 2027 |
| AI-based Room Recommendations | 🔮 Vision | Q3 2027 |
| Chatbot for Customer Support | 🔮 Vision | Q4 2027 |

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2026 Grand Hotel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...

Full license text available in the LICENSE file.
```

---

## 🙏 Acknowledgments

- **Unsplash** - Background images
- **React Community** - Excellent documentation
- **MongoDB** - Database solutions
- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **All Contributors** - Testing and feedback

---

## 📞 Support

| Channel | Contact |
|---------|---------|
| GitHub Issues | [Create Issue](https://github.com/bhupendra272003/hotel-management-system/issues) |
| Email | support@grandhotel.com |
| Documentation | [Wiki](https://github.com/bhupendra272003/hotel-management-system/wiki) |

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ by Grand Hotel Team**
