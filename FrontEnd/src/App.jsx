import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProductListing from "./pages/products/ProductsListing";
import ProductView from "./pages/products/ProductView";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/dashboard/AdminLayout"; // Corrected import
import AddProduct from "./pages/admin/sidebar/Product/AddProduct";
import ContentManagement from "./pages/admin/sidebar/contentManagement/ContentManagement";
import Orders from "./pages/admin/sidebar/order/Orders";
import Users from "./pages/admin/sidebar/users/Users";
import Settings from "./pages/admin/sidebar/settings/Settings";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Categories from "./pages/admin/sidebar/categories/Categories";
import AddBrands from "./pages/admin/sidebar/brands/AddBrands";
import AddCategories from "./pages/admin/sidebar/categories/AddCategories";
import Brands from "./pages/admin/sidebar/brands/Brands";
import OrderDetails from "./pages/admin/sidebar/order/OrderDetails";
import ProductTable from "./pages/admin/sidebar/Product/ProductTable";
import UserProfile from "./pages/userProfile/UserProfile";
import CartView from "./pages/cart/CartView";
import Checkout from "./pages/checkout/Checkout";
import OrderConfirmation from "./pages/order/OrderConfirmation";
import OrderHistory from "./pages/orders/OrderHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin101" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="products/table" element={<ProductTable />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<AddProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategories />} />
          <Route path="categories/edit/:id" element={<AddCategories />} />
          <Route path="brands/add" element={<AddBrands />} />
          <Route path="brands/edit/:id" element={<AddBrands />} />
          <Route path="brands" element={<Brands />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/products"
          element={
            // <ProtectedRoute>
              <ProductListing />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            // <ProtectedRoute>
              <ProductView />
            // </ProtectedRoute>
          }
        />
        <Route path="user/profile" element={<UserProfile />} />
        <Route path="products/cart" element={<CartView />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order/:id" element={<OrderConfirmation />} />
        <Route
          path="my-orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
