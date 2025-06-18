import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const navigate = useNavigate();
  const token = Cookies.get("tokenUser");
  const [money, setMoney] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Chỉ lấy thông tin tài khoản nếu đã đăng nhập
    const fetchUserData = async () => {
      try {
        if (token) {
          const res = await fetch("http://localhost:5000/auth/me", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.ok) {
            const data = await res.json();
            setMoney(data.money);
            setFullName(data.fullName);
            setRole(data.role);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy số dư tài khoản:", error);
      }
    };
    fetchUserData();
  }, [token]);

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
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "20px", // Khoảng cách giữa các item
    },
    money: {
      fontSize: "18px",
      fontWeight: 500,
      background: "#34495e",
      padding: "6px 20px",
      borderRadius: "16px",
      minWidth: "120px",
      textAlign: "center",
      letterSpacing: 1,
    },
    role: {
      fontSize: "16px",
      fontWeight: 400,
      background: "#27ae60",
      color: "white",
      padding: "4px 16px",
      borderRadius: "10px",
      marginLeft: "8px",
      textTransform: "capitalize",
    },
    authContainer: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
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

  // Có thể map role thành tên dễ hiểu nếu muốn (ví dụ: 1 = User, 2 = Admin)
  const getRoleName = (role) => {
    switch (role) {
      case 3:
        return "Admin";
      case 2:
        return "Manager";
      default:
        return "User";
    }
  };

  return (
    <header style={styles.header}>
      <h2>📄 Hệ thống quản lý tài liệu</h2>
      {token ? (
        <div style={styles.userInfo}>
          <div style={styles.money}>
            Số dư: {money !== null ? money.toLocaleString() + " đ" : "..."}
          </div>
          <div style={{ fontWeight: 500, fontSize: 17 }}>
            👤 {fullName || "..."}
          </div>
          <div style={styles.role}>
            {role !== null ? getRoleName(role) : ""}
          </div>
        </div>
      ) : (
        <div style={styles.money}>Số dư: -</div>
      )}
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