import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    // Dispatch event to notify other components about theme change
    window.dispatchEvent(new Event('themechange'));
  }, [dark]);

  return (
    <button 
      onClick={() => setDark(!dark)} 
      className="theme-toggle"
      style={{
        background: dark ? 'linear-gradient(135deg, #2c3e50, #1a5276)' : 'linear-gradient(135deg, #3498db, #2980b9)',
        borderRadius: '50px',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      }}
    >
      <span style={{ fontSize: '20px' }}>{dark ? '🌙' : '☀️'}</span>
      <span>{dark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
}