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
  assigned_agent: number | null;
  assigned_agent_username: string | null;
  created_at: string;
}

interface Agent {
  id: number;
  username: string;
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

type FilterStatus = "ALL" | "OPEN" | "IN_PROGRESS" | "CLOSED";

function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [reqRes, agentRes] = await Promise.all([
        api.get("/admin/requests/"),
        api.get("/admin/agents/"),
      ]);
      setRequests(reqRes.data);
      setAgents(agentRes.data);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateRequest = async (id: number, patch: Partial<{ status: string; assigned_agent: number | null }>) => {
    setUpdatingId(id);
    try {
      const res = await api.patch(`/admin/requests/${id}/`, patch);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, ...res.data } : r));
    } catch {
      alert("Failed to update.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const filtered = filterStatus === "ALL" ? requests : requests.filter(r => r.status === filterStatus);
  const counts = {
    total: requests.length,
    open: requests.filter(r => r.status === "OPEN").length,
    inProgress: requests.filter(r => r.status === "IN_PROGRESS").length,
    closed: requests.filter(r => r.status === "CLOSED").length,
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
          <p style={{ margin: 0, color: "#666" }}>Welcome, {username}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#f44336", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total", value: counts.total, color: "#1976d2" },
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

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["ALL", "OPEN", "IN_PROGRESS", "CLOSED"] as FilterStatus[]).map(f => (
          <button key={f} onClick={() => setFilterStatus(f)} style={{
            padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
            background: filterStatus === f ? "#1976d2" : "#e0e0e0",
            color: filterStatus === f ? "#fff" : "#333",
          }}>
            {f.replace("_", " ")}
          </button>
        ))}
        <button onClick={fetchData} style={{
          marginLeft: "auto", padding: "7px 16px", borderRadius: 6,
          border: "1px solid #1976d2", background: "#fff", color: "#1976d2",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>
          ↻ Refresh
        </button>
      </div>

      {loading && <p style={{ color: "#666" }}>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "#aaa", border: "1px dashed #ddd", borderRadius: 10 }}>
          No requests found.
        </div>
      )}

      {filtered.map(req => (
        <div key={req.id} style={{
          border: "1px solid #e0e0e0", borderRadius: 10, padding: 18, marginBottom: 14,
          background: "#fafafa", opacity: updatingId === req.id ? 0.7 : 1,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ margin: "0 0 4px" }}>{req.title}</h3>
              <span style={{ fontSize: 13, color: "#888" }}>Customer: <strong>{req.customer_username}</strong></span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge label={req.priority} color={PRIORITY_COLOR[req.priority]} />
              <Badge label={req.status.replace("_", " ")} color={STATUS_COLOR[req.status]} />
            </div>
          </div>

          <p style={{ margin: "10px 0 14px", color: "#555", fontSize: 14 }}>{req.description}</p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {/* Assign Agent */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Assign Agent:</label>
              <select
                value={req.assigned_agent ?? ""}
                disabled={updatingId === req.id}
                onChange={e => updateRequest(req.id, { assigned_agent: e.target.value ? Number(e.target.value) : null })}
                style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13 }}
              >
                <option value="">— Unassigned —</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.username}</option>
                ))}
              </select>
              {req.assigned_agent_username && (
                <span style={{ fontSize: 12, color: "#4caf50", fontWeight: 600 }}>✓ {req.assigned_agent_username}</span>
              )}
            </div>

            {/* Update Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Status:</label>
              {(["OPEN", "IN_PROGRESS", "CLOSED"] as const).map(s => (
                <button key={s}
                  disabled={req.status === s || updatingId === req.id}
                  onClick={() => updateRequest(req.id, { status: s })}
                  style={{
                    padding: "4px 12px", borderRadius: 6, border: "1px solid",
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
            </div>

            <span style={{ marginLeft: "auto", fontSize: 12, color: "#bbb" }}>
              {new Date(req.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;