import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/config";

export default function BillStatus({ roomNo }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomNo) {
      fetchBillStatus();
    }
  }, [roomNo]);

  const fetchBillStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/billing/bill/${roomNo}`);
      if (response.data.success) {
        setBill(response.data.bill);
      }
    } catch (error) {
      console.error("Error fetching bill status:", error);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading bill status...</div>;
  if (!bill) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#dc3c3c' }}>Bill Status</h4>
      <p><strong>Total:</strong> ₹{bill.total?.toLocaleString()}</p>
      <p><strong>Paid:</strong> ₹{bill.totalAmountPaid?.toLocaleString()}</p>
      <p><strong>Remaining:</strong> ₹{bill.remainingAmount?.toLocaleString()}</p>
      <div style={{
        height: '8px',
        background: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '10px'
      }}>
        <div style={{
          width: `${(bill.totalAmountPaid / bill.total) * 100}%`,
          height: '100%',
          background: '#4caf50',
          transition: 'width 0.5s ease'
        }}></div>
      </div>
      <p style={{ fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
        Status: {bill.paymentStatus === 'paid' ? '✅ Fully Paid' : bill.paymentStatus === 'partial' ? '⚠️ Partially Paid' : '❌ Pending'}
      </p>
    </div>
  );
}
