import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    title: { textAlign: "center", marginBottom: "24px", color: "#2c3e50" },
    input: {
      width: "100%",
      padding: "10px 14px",
      marginBottom: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#2c3e50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
      fontWeight: "600",
    },
    error: { color: "red", marginBottom: "12px", textAlign: "center" },
    link: {
      display: "block",
      marginTop: "16px",
      textAlign: "center",
      color: "#2c3e50",
      textDecoration: "none",
      fontWeight: "500",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);
      if (data.code !== 200) {
        setError(data.massage || "Đăng nhập thất bại");
        return;
      }
      const token = data.token;
      const role = data.role;
      Cookies.set("tokenUser", token, { expires: 1000 }); 
      localStorage.setItem('user', JSON.stringify({ email, role, token }));

      navigate("/");
      
    } catch (err) {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng nhập</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={1}
        />
        <button style={styles.button} type="submit">
          Đăng nhập
        </button>
      </form>
      <Link to="/register" style={styles.link}>
        Chưa có tài khoản? Đăng ký
      </Link>
    </div>
  );
};

export default Login;
