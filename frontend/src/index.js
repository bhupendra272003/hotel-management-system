import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Styles/theme.css";
import "./Styles/sunset.css";
import "./Styles/rain.css";
import "./Styles/responsive.css";
import "./Styles/hotel.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);