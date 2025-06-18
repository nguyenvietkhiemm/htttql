import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const navigate = useNavigate();
  const token = Cookies.get("tokenUser");

  const handleLogout = () => {
    Cookies.remove("tokenUser");
    navigate("/login");
  };

  const styles = {
    header: {
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "16px 32px",
      fontSize: "20px",
      fontWeight: "600",
      display: "flex",
      
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    authContainer: {
      display: "flex",
      gap: "12px",
    },
    button: {
      backgroundColor: "white",
      color: "#2c3e50",
      border: "none",
      padding: "8px 16px",
      fontWeight: "500",
      borderRadius: "8px",
      textDecoration: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    logoutButton: {
      backgroundColor: "#e74c3c",
      color: "white",
    },
  };

  return (
    <header style={styles.header}>
      <h2>📄 Hệ thống quản lý tài liệu</h2>
      <div style={styles.authContainer}>
        {!token ? (
          <>
            <Link to="/login" style={styles.button}>Đăng nhập</Link>
            <Link to="/register" style={styles.button}>Đăng ký</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{ ...styles.button, ...styles.logoutButton }}
          >
            Đăng xuất
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
