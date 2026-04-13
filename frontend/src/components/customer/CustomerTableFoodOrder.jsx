import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerTableFoodOrder() {
  const [tableNumber, setTableNumber] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const menu = [
    { name: "🍗 Chicken Biryani", price: 250 },
    { name: "🍛 Butter Chicken", price: 350 },
    { name: "🫘 Dal Makhani", price: 200 },
    { name: "🥖 Garlic Naan", price: 40 },
    { name: "🍨 Ice Cream", price: 100 },
    { name: "☕ Coffee", price: 80 },
    { name: "🥗 Garden Salad", price: 120 },
    { name: "🍜 Veg Noodles", price: 180 }
  ];

  const addItem = (item) => {
    setItems([...items, item]);
    setTotal(total + item.price);
  };

  const removeItem = (idx) => {
    const newItems = [...items];
    setTotal(total - newItems[idx].price);
    newItems.splice(idx, 1);
    setItems(newItems);
  };

  const placeOrder = async () => {
    if (!tableNumber) {
      setMessage({ type: "error", text: "Please enter table number" });
      return;
    }
    if (items.length === 0) {
      setMessage({ type: "error", text: "Please add at least one item" });
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/food/table-order", {
        tableNumber,
        items: items.map(i => i.name),
        total,
        customerName,
        customerPhone
      });
      
      if (res.data.success) {
        setMessage({ type: "success", text: "✅ Order placed! Waiter will serve shortly." });
        setItems([]);
        setTotal(0);
        setTableNumber("");
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: res.data.error || "Order failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Order failed. Table may not be occupied." });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", background: "var(--bg-card)", borderRadius: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3c3c" }}>🍽️ Order Food at Table</h2>
      
      {message && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          color: message.type === "success" ? "#155724" : "#721c24"
        }}>
          {message.text}
        </div>
      )}
      
      <input
        type="text"
        placeholder="Table Number (e.g., T01, T02)"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value.toUpperCase())}
        style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "2px solid var(--border-color)", background: "var(--bg-glass)", color: "var(--text-primary)" }}
      />
      
      <input
        type="text"
        placeholder="Your Name (optional)"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "2px solid var(--border-color)", background: "var(--bg-glass)", color: "var(--text-primary)" }}
      />
      
      <input
        type="tel"
        placeholder="Phone Number (optional)"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "2px solid var(--border-color)", background: "var(--bg-glass)", color: "var(--text-primary)" }}
      />

      <h3 style={{ marginBottom: "15px" }}>📋 Menu</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "10px", marginBottom: "20px" }}>
        {menu.map((item, i) => (
          <button
            key={i}
            onClick={() => addItem(item)}
            style={{
              background: "linear-gradient(135deg, #ff9800, #f57c00)",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {item.name}<br/>₹{item.price}
          </button>
        ))}
      </div>

      {items.length > 0 && (
        <div style={{ border: "2px solid var(--border-color)", padding: "15px", borderRadius: "12px", marginBottom: "20px" }}>
          <h4>🛒 Your Order</h4>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-color)" }}>
              <span>{item.name} - ₹{item.price}</span>
              <button onClick={() => removeItem(idx)} style={{ background: "#f44336", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>Remove</button>
            </div>
          ))}
          <p style={{ marginTop: "10px", fontSize: "1.2rem", fontWeight: "bold" }}><strong>Total: ₹{total}</strong></p>
        </div>
      )}

      <button
        onClick={placeOrder}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: "linear-gradient(135deg, #4caf50, #388e3c)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
      
      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          padding: "12px",
          background: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Back to Home
      </button>
    </div>
  );
}