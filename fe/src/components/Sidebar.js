import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
  // console.log(user); 
  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        <li><Link to="/">Tổng quan</Link></li>
        <li><Link to="/document">Danh sách tài liệu</Link></li>
        
        {user?.role === 3 && ( // Chỉ hiển thị nếu role === 3
          <li><Link to="/role-management">Phân Quyền</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
