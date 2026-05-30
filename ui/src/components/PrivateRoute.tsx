import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement;
  allowedRole: string;
}

function PrivateRoute({ children, allowedRole }: Props) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role !== allowedRole) return <Navigate to="/login" />;

  return children;
}

export default PrivateRoute;