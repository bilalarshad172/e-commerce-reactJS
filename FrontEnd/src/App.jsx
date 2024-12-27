import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProductListing from "./pages/products/ProductsListing";
import ProductView from "./pages/products/ProductView";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/dashboard/AdminLayout"; // Corrected import
import AddProduct from "./pages/admin/sidebar/Product/AddProduct";
import ContentManagement from "./pages/admin/sidebar/contentManagement/ContentManagement";
import Orders from "./pages/admin/sidebar/order/Orders";
import Users from "./pages/admin/sidebar/users/Users";
import Settings from "./pages/admin/sidebar/settings/Settings";
import Dashboard from "./pages/admin/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin101" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="products" element={<AddProduct />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Protected Routes */}
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
