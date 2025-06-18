import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <main style={{ marginLeft: 220, padding: 20 }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
