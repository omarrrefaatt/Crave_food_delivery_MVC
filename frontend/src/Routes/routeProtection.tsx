import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Common/Contexts/Auth/AuthHook";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user } = useAuthContext();
  console.log("ProtectedRoute user:", user);
  console.log("ProtectedRoute requiredRole:", requiredRole);
  // if (!user || !user.role || (requiredRole && user.role !== requiredRole)) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;
