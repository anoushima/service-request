import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./components/AdminDashboard";
import AgentDashboard from "./components/AgentDashboard";
import CustomerDashboard from "./components/CustomerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRole="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/agent/dashboard"
          element={
            <PrivateRoute allowedRole="AGENT">
              <AgentDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute allowedRole="CUSTOMER">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;