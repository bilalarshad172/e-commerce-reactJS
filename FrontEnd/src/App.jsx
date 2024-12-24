import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProductListing from "./pages/products/ProductsListing";
import ProductView from "./pages/products/ProductView";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashbaord from "./pages/admin/dashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin101" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashbaord />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
