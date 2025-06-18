// src/middleware/RequireAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("tokenUser");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

export default RequireAuth;
