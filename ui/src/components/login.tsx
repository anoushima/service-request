import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/login/", formData);
      const { access, refresh, role, username } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username); // was missing before

      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "AGENT") navigate("/agent/dashboard");
      else if (role === "CUSTOMER") navigate("/customer/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f0f2f5", fontFamily: "sans-serif",
    }}>
      <div style={{
        background: "#fff", padding: 40, borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.1)", width: "100%", maxWidth: 380,
      }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>Service Portal</h2>
        <p style={{ margin: "0 0 24px", color: "#666" }}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange}
              placeholder="Enter username" required
              style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box", fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="Enter password" required
              style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box", fontSize: 14 }}
            />
          </div>

          {error && (
            <p style={{ color: "#d32f2f", background: "#ffebee", padding: "8px 12px", borderRadius: 6, margin: "0 0 16px", fontSize: 14 }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: 11, background: loading ? "#90caf9" : "#1976d2",
            color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;