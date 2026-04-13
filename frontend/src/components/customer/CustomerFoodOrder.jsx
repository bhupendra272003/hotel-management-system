import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerFoodOrder() {
  const [roomNo, setRoom] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const menuItems = [
    { name: "🍗 Chicken Biryani", price: 250 },
    { name: "🍛 Butter Chicken", price: 350 },
    { name: "🫘 Dal Makhani", price: 200 },
    { name: "🥖 Garlic Naan", price: 40 },
    { name: "🍨 Ice Cream", price: 100 },
    { name: "☕ Coffee", price: 80 },
    { name: "🥗 Garden Salad", price: 120 },
    { name: "🍜 Veg Noodles", price: 180 },
    { name: "🍕 Margherita Pizza", price: 450 },
    { name: "🍔 Veg Burger", price: 150 }
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

  const submit = async () => {
    if (!roomNo) {
      alert("Please enter your room number");
      return;
    }
    if (items.length === 0) {
      alert("Please add some items to your order");
      return;
    }
    
    await axios.post("http://localhost:5000/api/customer/order-food", {
      roomNo,
      items: items.map(i => i.name),
      total: total,
      status: "pending"
    });
    alert(`✅ Order placed successfully! Total: ₹${total}\nYour food will be delivered to Room ${roomNo}`);
    setItems([]);
    setTotal(0);
    setRoom("");
  };

  return (
    <div className="customer-food">
      <h2>🍕 Order Food</h2>
      <input 
        placeholder="Enter your Room Number" 
        onChange={e => setRoom(e.target.value)} 
        value={roomNo}
      />
      
      <div className="menu-grid">
        <h3>Our Menu</h3>
        <div className="menu-items">
          {menuItems.map((item, i) => (
            <button key={i} onClick={() => addItem(item.name, item.price)} className="menu-item">
              {item.name} - ₹{item.price}
            </button>
          ))}
        </div>
      </div>
      
      <div className="order-summary">
        <h3>Your Order</h3>
        {items.length === 0 ? (
          <p>No items added yet</p>
        ) : (
          <>
            <ul>
              {items.map((item, i) => (
                <li key={i}>
                  {item.name} - ₹{item.price}
                  <button onClick={() => removeItem(i)} className="remove-btn">❌</button>
                </li>
              ))}
            </ul>
            <h4>Total: ₹{total}</h4>
          </>
        )}
      </div>
      
      <button onClick={submit}>Place Order</button>
      <button onClick={() => navigate("/")} className="back-btn">Back to Home</button>
    </div>
  );
}