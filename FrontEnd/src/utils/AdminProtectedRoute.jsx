import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If not authenticated, redirect to admin login page
  if (!isAuthenticated) {
    return <Navigate to="/admin101" />;
  }

  // If authenticated but not admin, redirect to admin login page
  if (user && user.role !== "admin") {
    return <Navigate to="/admin101" />;
  }

  // If authenticated and admin, render the child component
  return children;
};

export default AdminProtectedRoute;
