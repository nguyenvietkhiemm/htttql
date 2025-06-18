import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "20px" }}>
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
