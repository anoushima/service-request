import { useNavigate } from "react-router-dom";

function AgentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <p>View and manage your assigned service requests.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AgentDashboard;