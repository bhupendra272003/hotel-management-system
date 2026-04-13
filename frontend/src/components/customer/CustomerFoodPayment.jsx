import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerFoodPayment() {
  const [roomNo, setRoomNo] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!roomNo) {
      setMessage({ type: "error", text: "Please enter your room number" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await axios.get(`http://localhost:5000/api/food/room/${roomNo}`);
      console.log("Fetched orders:", res.data);
      
      if (res.data.length === 0) {
        setMessage({ type: "info", text: "No pending orders found for this room" });
        setOrders([]);
      } else {
        setOrders(res.data);
        setMessage({ type: "success", text: `Found ${res.data.length} pending order(s)` });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage({ type: "error", text: "Failed to fetch orders. Make sure backend is running." });
    }
    setLoading(false);
  };

  const processPayment = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    const transactionId = `FOOD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/food/pay/${selectedOrder._id}`, {
        paymentMethod,
        transactionId
      });
      
      console.log("Payment response:", response.data);
      
      if (response.data.success) {
        setMessage({ type: "success", text: `✅ Payment Successful! Transaction ID: ${transactionId}` });
        setShowPaymentModal(false);
        setSelectedOrder(null);
        // Refresh orders
        await fetchOrders();
      } else {
        setMessage({ type: "error", text: "Payment failed. Please try again." });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage({ type: "error", text: error.response?.data?.error || "Payment failed. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="customer-payment">
      <h2>🍕 Pay for Food Orders</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="room-input">
        <input
          type="text"
          placeholder="Enter your Room Number (e.g., 101)"
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
        />
        <button onClick={fetchOrders} disabled={loading}>
          {loading ? "Loading..." : "View Orders"}
        </button>
      </div>
      
      {orders.length > 0 && (
        <div className="orders-list">
          <h3>Your Pending Orders</h3>
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-6)}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              
              <div className="order-details">
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Items:</strong></p>
                <ul>
                  {order.items?.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
                <p className="total"><strong>Total Amount:</strong> ₹{order.total}</p>
              </div>
              
              <button onClick={() => processPayment(order)} className="pay-now-btn">
                Pay Now - ₹{order.total}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <h3>Complete Payment</h3>
            <div className="payment-details">
              <p><strong>Order ID:</strong> #{selectedOrder._id.slice(-6)}</p>
              <p><strong>Amount:</strong> ₹{selectedOrder.total}</p>
              <p><strong>Room:</strong> {selectedOrder.roomNo}</p>
            </div>
            
            <div className="payment-methods">
              <h4>Select Payment Method</h4>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                💵 Cash on Delivery
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                💳 Credit/Debit Card
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                📱 UPI (Google Pay, PhonePe)
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="room_charge"
                  checked={paymentMethod === "room_charge"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                🏨 Add to Room Bill
              </label>
            </div>
            
            <div className="modal-actions">
              <button onClick={confirmPayment} className="confirm-btn" disabled={loading}>
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
              <button onClick={() => setShowPaymentModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button onClick={() => navigate("/")} className="back-btn">
        Back to Home
      </button>
      
      <style jsx>{`
        .message {
          padding: 12px 20px;
          border-radius: 8px;
          margin: 15px 0;
          text-align: center;
        }
        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .message.info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        .room-input {
          display: flex;
          gap: 15px;
          margin: 20px 0;
        }
        .room-input input {
          flex: 1;
          padding: 12px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-glass);
          color: var(--text-primary);
        }
        .orders-list {
          margin-top: 30px;
        }
        .order-card {
          background: var(--bg-card);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        .order-id {
          font-weight: bold;
          color: var(--accent-primary);
        }
        .order-status {
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 12px;
        }
        .order-status.pending {
          background: #f59e0b;
          color: white;
        }
        .order-details ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .order-details li {
          margin: 5px 0;
        }
        .total {
          font-size: 1.2rem;
          margin-top: 10px;
          color: var(--accent-primary);
        }
        .pay-now-btn {
          width: 100%;
          margin-top: 15px;
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .payment-modal {
          background: var(--bg-card);
          padding: 30px;
          border-radius: 20px;
          max-width: 450px;
          width: 90%;
        }
        .payment-details {
          background: var(--bg-glass);
          padding: 15px;
          border-radius: 10px;
          margin: 15px 0;
        }
        .payment-methods {
          margin: 20px 0;
        }
        .payment-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          margin: 8px 0;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .payment-option:hover {
          background: var(--bg-glass);
          transform: translateX(5px);
        }
        .modal-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        .confirm-btn {
          flex: 1;
          background: #10b981;
        }
        .cancel-btn {
          flex: 1;
          background: #ef4444;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}