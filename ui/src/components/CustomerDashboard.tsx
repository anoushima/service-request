import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <h2>Customer Dashboard</h2>
      <p>Create and track your service requests.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default CustomerDashboard;