import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  customer_username: string;
  created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
  OPEN: "#2196f3", IN_PROGRESS: "#ff9800", CLOSED: "#4caf50",
};
const PRIORITY_COLOR: Record<string, string> = {
  LOW: "#4caf50", MEDIUM: "#ff9800", HIGH: "#f44336",
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
      background: color + "22", color,
    }}>{label}</span>
  );
}

function AgentDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Agent";
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/agent/requests/");
      setRequests(res.data);
    } catch {
      setError("Failed to load assigned requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/agent/requests/${id}/`, { status });
      setRequests(prev =>
        prev.map(r => r.id === id ? { ...r, status: status as ServiceRequest["status"] } : r)
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const counts = {
    total: requests.length,
    open: requests.filter(r => r.status === "OPEN").length,
    inProgress: requests.filter(r => r.status === "IN_PROGRESS").length,
    closed: requests.filter(r => r.status === "CLOSED").length,
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Agent Dashboard</h2>
          <p style={{ margin: 0, color: "#666" }}>Welcome, {username}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#f44336", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Assigned", value: counts.total, color: "#1976d2" },
          { label: "Open", value: counts.open, color: "#2196f3" },
          { label: "In Progress", value: counts.inProgress, color: "#ff9800" },
          { label: "Closed", value: counts.closed, color: "#4caf50" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#666" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ margin: "0 0 14px" }}>Assigned Requests</h3>
      {loading && <p style={{ color: "#666" }}>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && requests.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "#aaa", border: "1px dashed #ddd", borderRadius: 10 }}>
          No requests assigned to you yet.
        </div>
      )}

      {requests.map(req => (
        <div key={req.id} style={{ border: "1px solid #e0e0e0", borderRadius: 10, padding: 18, marginBottom: 12, background: "#fafafa" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ margin: "0 0 4px" }}>{req.title}</h3>
              <span style={{ fontSize: 13, color: "#888" }}>From: <strong>{req.customer_username}</strong></span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge label={req.priority} color={PRIORITY_COLOR[req.priority]} />
              <Badge label={req.status.replace("_", " ")} color={STATUS_COLOR[req.status]} />
            </div>
          </div>
          <p style={{ margin: "10px 0 12px", color: "#555", fontSize: 14 }}>{req.description}</p>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#888" }}>Update status:</span>
            {(["OPEN", "IN_PROGRESS", "CLOSED"] as const).map(s => (
              <button key={s}
                disabled={req.status === s || updatingId === req.id}
                onClick={() => updateStatus(req.id, s)}
                style={{
                  padding: "5px 12px", borderRadius: 6, border: "1px solid",
                  borderColor: req.status === s ? STATUS_COLOR[s] : "#ccc",
                  background: req.status === s ? STATUS_COLOR[s] + "22" : "#fff",
                  color: req.status === s ? STATUS_COLOR[s] : "#555",
                  fontWeight: req.status === s ? 700 : 400,
                  cursor: req.status === s || updatingId === req.id ? "not-allowed" : "pointer",
                  fontSize: 13,
                }}
              >
                {s.replace("_", " ")}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#bbb" }}>
              {new Date(req.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AgentDashboard;