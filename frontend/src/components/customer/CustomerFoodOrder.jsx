import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function CustomerFoodOrder() {
  const [roomNo, setRoom] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { name: "🍗 Chicken Biryani", price: 250 },
    { name: "🍛 Butter Chicken", price: 350 },
    { name: "🫘 Dal Makhani", price: 200 },
    { name: "🥖 Garlic Naan", price: 40 },
    { name: "🍨 Ice Cream", price: 100 },
    { name: "☕ Coffee", price: 80 },
    { name: "🥗 Garden Salad", price: 120 },
    { name: "🍜 Veg Noodles", price: 180 }
  ];

  const addItem = (itemName, itemPrice) => {
    setItems([...items, { name: itemName, price: itemPrice }]);
    setTotal(total + itemPrice);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    setTotal(total - newItems[index].price);
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const placeOrder = async () => {
    if (!roomNo) {
      setMessage({ type: "error", text: "Please enter your room number" });
      return;
    }
    if (items.length === 0) {
      setMessage({ type: "error", text: "Please add some items to your order" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/food`, {
        roomNo,
        items: items.map(i => i.name),
        total,
        customerName,
        customerPhone,
        orderType: "room_delivery"
      });
      
      if (response.data.success) {
        setMessage({ type: "success", text: `✅ Order placed successfully! Total: ₹${total}\nYour food will be delivered to Room ${roomNo}` });
        setItems([]);
        setTotal(0);
        setRoom("");
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to place order. Please try again." });
    }
    setLoading(false);
  };

  const placeTableOrder = async () => {
    if (!roomNo) {
      setMessage({ type: "error", text: "Please enter your table number" });
      return;
    }
    if (items.length === 0) {
      setMessage({ type: "error", text: "Please add some items to your order" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/food/table-order`, {
        tableNumber: roomNo,
        items: items.map(i => i.name),
        total,
        customerName,
        customerPhone
      });
      
      if (response.data.success) {
        setMessage({ type: "success", text: `✅ Order placed successfully! Total: ₹${total}\nYour food will be served at Table ${roomNo}` });
        setItems([]);
        setTotal(0);
        setRoom("");
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to place order. Table may not be occupied." });
    }
    setLoading(false);
  };

  return (
    <div className="customer-food" style={{ maxWidth: "700px", margin: "40px auto", padding: "30px", background: "var(--bg-card)", borderRadius: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>🍕 Order Food</h2>
      
      {message && (
        <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>
          {message.text}
        </div>
      )}
      
      <input 
        placeholder="Room Number or Table Number" 
        onChange={e => setRoom(e.target.value)} 
        value={roomNo}
        style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "2px solid var(--border-color)" }}
      />
      
      <input 
        placeholder="Your Name (optional)" 
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "2px solid var(--border-color)" }}
      />
      
      <input 
        placeholder="Phone Number (optional)" 
        value={customerPhone}
        onChange={e => setCustomerPhone(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "2px solid var(--border-color)" }}
      />

      <h3>📋 Menu</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "10px", marginBottom: "20px" }}>
        {menuItems.map((item, i) => (
          <button key={i} onClick={() => addItem(item.name, item.price)} style={{ background: "#ff9800", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>
            {item.name}<br/>₹{item.price}
          </button>
        ))}
      </div>
      
      <div className="order-summary" style={{ border: "2px solid var(--border-color)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <h3>🛒 Your Order</h3>
        {items.length === 0 ? (
          <p>No items added yet</p>
        ) : (
          <>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-color)" }}>
                <span>{item.name}</span>
                <div>
                  <span style={{ marginRight: "15px" }}>₹{item.price}</span>
                  <button onClick={() => removeItem(i)} style={{ background: "#f44336", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>✕</button>
                </div>
              </div>
            ))}
            <h4 style={{ marginTop: "10px" }}>Total: ₹{total}</h4>
          </>
        )}
      </div>
      
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={placeOrder} disabled={loading} style={{ flex: 1, padding: "12px", background: "#4caf50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          {loading ? "Placing..." : "🚪 Deliver to Room"}
        </button>
        <button onClick={placeTableOrder} disabled={loading} style={{ flex: 1, padding: "12px", background: "#ff9800", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          {loading ? "Placing..." : "🍽️ Serve at Table"}
        </button>
      </div>
      
      <button onClick={() => navigate("/")} style={{ width: "100%", padding: "12px", marginTop: "20px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        Back to Home
      </button>
    </div>
  );
}
