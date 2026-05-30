import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  created_at: string;
  updated_at: string;
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: "#2196f3",
  IN_PROGRESS: "#ff9800",
  CLOSED: "#4caf50",
};

const PRIORITY_COLOR: Record<string, string> = {
  LOW: "#4caf50",
  MEDIUM: "#ff9800",
  HIGH: "#f44336",
};

function CustomerDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Customer";

  const [view, setView] = useState<"list" | "create">("list");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "LOW",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/requests/");
      setRequests(res.data);
    } catch {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") fetchRequests();
  }, [view]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Description is required.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await api.post("/requests/create/", formData);
      setSuccess("Service request created successfully!");
      setFormData({ title: "", description: "", priority: "LOW" });
      setTimeout(() => {
        setSuccess("");
        setView("list");
      }, 1500);
    } catch {
      setFormError("Failed to create request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 800, margin: "0 auto", padding: 24 }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Customer Dashboard</h2>
          <p style={{ margin: 0, color: "#666" }}>Welcome, {username}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: "8px 16px", background: "#f44336", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      {/* Tab Buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setView("list")}
          style={{
            padding: "10px 20px",
            background: view === "list" ? "#1976d2" : "#e0e0e0",
            color: view === "list" ? "#fff" : "#333",
            border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600,
          }}
        >
          My Requests
        </button>
        <button
          onClick={() => { setView("create"); setFormError(""); setSuccess(""); }}
          style={{
            padding: "10px 20px",
            background: view === "create" ? "#1976d2" : "#e0e0e0",
            color: view === "create" ? "#fff" : "#333",
            border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600,
          }}
        >
          + New Request
        </button>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <div>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && requests.length === 0 && (
            <p style={{ color: "#888" }}>No service requests yet. Create one!</p>
          )}
          {requests.map((req) => (
            <div
              key={req.id}
              style={{
                border: "1px solid #e0e0e0", borderRadius: 8, padding: 16,
                marginBottom: 12, background: "#fafafa",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: 0 }}>{req.title}</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{
                    padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                    background: PRIORITY_COLOR[req.priority] + "22",
                    color: PRIORITY_COLOR[req.priority],
                  }}>
                    {PRIORITY_LABEL[req.priority]}
                  </span>
                  <span style={{
                    padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                    background: STATUS_COLOR[req.status] + "22",
                    color: STATUS_COLOR[req.status],
                  }}>
                    {STATUS_LABEL[req.status]}
                  </span>
                </div>
              </div>
              <p style={{ margin: "8px 0 4px", color: "#555" }}>{req.description}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
                Created: {new Date(req.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CREATE VIEW */}
      {view === "create" && (
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 24 }}>
          <h3 style={{ marginTop: 0 }}>Create Service Request</h3>

          {success && (
            <p style={{ color: "green", background: "#e8f5e9", padding: 10, borderRadius: 6 }}>{success}</p>
          )}
          {formError && (
            <p style={{ color: "red", background: "#ffebee", padding: 10, borderRadius: 6 }}>{formError}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Request Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter request title"
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue in detail"
                rows={4}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box", resize: "vertical" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box" }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "10px 24px", background: submitting ? "#90caf9" : "#1976d2",
                  color: "#fff", border: "none", borderRadius: 6, cursor: submitting ? "not-allowed" : "pointer", fontWeight: 600,
                }}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                style={{ padding: "10px 24px", background: "#e0e0e0", border: "none", borderRadius: 6, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;