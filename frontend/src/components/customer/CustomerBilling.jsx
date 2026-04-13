import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerBilling() {
  const [roomNo, setRoomNo] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const fetchBill = async () => {
    if (!roomNo) {
      alert("Please enter your room number");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/billing/room/${roomNo}`);
      const bookingsRes = await axios.get("http://localhost:5000/api/booking");
      const booking = bookingsRes.data.find(b => b.roomNo === roomNo && b.status === "CheckedIn");
      
      if (!booking) {
        alert("No active booking found for this room");
        setLoading(false);
        return;
      }
      
      const roomRate = booking.roomType === "Suite" ? 5000 : 
                       booking.roomType === "Deluxe" ? 3000 : 1500;
      const roomCharge = roomRate * booking.days;
      const foodTotal = res.data.reduce((sum, b) => sum + (b.foodCharge || 0), 0);
      const tax = (roomCharge + foodTotal) * 0.18;
      const total = roomCharge + foodTotal + tax;
      
      setBillDetails({
        guestName: booking.name,
        roomNo: booking.roomNo,
        roomType: booking.roomType,
        days: booking.days,
        roomCharge,
        foodTotal,
        tax,
        total,
        existingBills: res.data
      });
    } catch (error) {
      alert("Error fetching bill details");
    }
    setLoading(false);
  };

  const processPayment = async () => {
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Process each unpaid bill
      for (const bill of billDetails.existingBills) {
        await axios.put(`http://localhost:5000/api/billing/pay/${bill._id}`, {
          paymentMethod,
          transactionId,
          amount: bill.total
        });
      }
      
      // Also create a new bill if no existing bills
      if (billDetails.existingBills.length === 0) {
        await axios.post("http://localhost:5000/api/billing", {
          roomNo: billDetails.roomNo,
          guestName: billDetails.guestName,
          roomCharge: billDetails.roomCharge,
          foodCharge: billDetails.foodTotal,
          tax: billDetails.tax,
          total: billDetails.total,
          paymentMethod,
          paymentStatus: "paid",
          transactionId,
          paymentDate: new Date()
        });
      }
      
      setPaymentStatus({
        success: true,
        message: "Payment processed successfully!",
        transactionId,
        amount: billDetails.total,
        method: paymentMethod
      });
      
      setShowConfirmation(false);
      setTimeout(() => {
        alert(`✅ Payment Successful!\nAmount: ₹${billDetails.total}\nTransaction ID: ${transactionId}\nThank you for staying with us!`);
        navigate("/");
      }, 1500);
      
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: "Payment failed. Please try again."
      });
      setTimeout(() => setPaymentStatus(null), 3000);
    }
    setLoading(false);
  };

  const cancelPayment = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="customer-billing">
      <h2>💰 View Bill & Make Payment</h2>
      
      <div className="room-input">
        <input 
          placeholder="Enter your Room Number" 
          value={roomNo}
          onChange={e => setRoomNo(e.target.value)}
        />
        <button onClick={fetchBill}>View Bill</button>
      </div>
      
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
      
      {billDetails && (
        <div className="bill-details">
          <h3>🧾 Bill Details</h3>
          <div className="guest-info">
            <p><strong>Guest Name:</strong> {billDetails.guestName}</p>
            <p><strong>Room Number:</strong> {billDetails.roomNo}</p>
            <p><strong>Room Type:</strong> {billDetails.roomType}</p>
            <p><strong>Number of Days:</strong> {billDetails.days}</p>
          </div>
          
          <div className="charges">
            <h4>Charges Breakdown</h4>
            <div className="charge-item">
              <span>Room Charges:</span>
              <span>₹{billDetails.roomCharge.toLocaleString()}</span>
            </div>
            <div className="charge-item">
              <span>Food Charges:</span>
              <span>₹{billDetails.foodTotal.toLocaleString()}</span>
            </div>
            <div className="charge-item">
              <span>Tax (18% GST):</span>
              <span>₹{billDetails.tax.toLocaleString()}</span>
            </div>
            <hr />
            <div className="charge-item total">
              <strong>Total Amount:</strong>
              <strong>₹{billDetails.total.toLocaleString()}</strong>
            </div>
          </div>
          
          <div className="payment-section">
            <h4>Payment Method</h4>
            <select onChange={e => setPaymentMethod(e.target.value)} value={paymentMethod}>
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Credit/Debit Card</option>
              <option value="upi">📱 UPI (Google Pay, PhonePe, etc.)</option>
            </select>
            <button onClick={processPayment} className="pay-btn">
              Pay ₹{billDetails.total.toLocaleString()}
            </button>
          </div>
        </div>
      )}
      
      {/* Payment Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="payment-confirmation-modal">
            <h3>Confirm Payment</h3>
            <div className="confirmation-details">
              <p><strong>Amount:</strong> ₹{billDetails?.total.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
              <p><strong>Room:</strong> {billDetails?.roomNo}</p>
              <p><strong>Guest:</strong> {billDetails?.guestName}</p>
            </div>
            <div className="modal-actions">
              <button onClick={confirmPayment} className="confirm-btn">Confirm Payment</button>
              <button onClick={cancelPayment} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Status Message */}
      {paymentStatus && (
        <div className={`payment-status ${paymentStatus.success ? 'success' : 'error'}`}>
          {paymentStatus.success ? '✅' : '❌'} {paymentStatus.message}
          {paymentStatus.transactionId && (
            <p className="transaction-id">Transaction ID: {paymentStatus.transactionId}</p>
          )}
        </div>
      )}
      
      <button onClick={() => navigate("/")} className="back-btn">Back to Home</button>
      
      <style jsx>{`
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
          animation: fadeIn 0.3s ease;
        }
        
        .payment-confirmation-modal {
          background: var(--bg-card);
          padding: 30px;
          border-radius: 20px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          animation: slideUp 0.3s ease;
        }
        
        .confirmation-details {
          margin: 20px 0;
          padding: 15px;
          background: var(--bg-glass);
          border-radius: 10px;
          text-align: left;
        }
        
        .confirmation-details p {
          margin: 8px 0;
        }
        
        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }
        
        .confirm-btn {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
        }
        
        .cancel-btn {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
        }
        
        .payment-status {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 10px;
          animation: slideInRight 0.3s ease;
          z-index: 1001;
        }
        
        .payment-status.success {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: white;
        }
        
        .payment-status.error {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
        }
        
        .transaction-id {
          font-size: 12px;
          margin-top: 5px;
          opacity: 0.9;
        }
        
        .charge-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        
        .charge-item.total {
          font-size: 1.2rem;
          margin-top: 10px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .spinner {
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}