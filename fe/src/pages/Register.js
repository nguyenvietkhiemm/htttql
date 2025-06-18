import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // thêm tên
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
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (data.code !== 200) {
        setError(data.message || "Đăng ký thất bại");
        return;
      }

      Cookies.set("tokenUser", data.token, { expires: 1 });
      navigate("/");
    } catch (err) {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng ký</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        />
        <button style={styles.button} type="submit">
          Đăng ký
        </button>
      </form>
      <Link to="/login" style={styles.link}>
        Đã có tài khoản? Đăng nhập
      </Link>
    </div>
  );
};

export default Register;
