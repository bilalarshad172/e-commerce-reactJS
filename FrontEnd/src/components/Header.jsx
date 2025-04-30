import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaHeart, FaBars } from "react-icons/fa";
import Profile from "./Profile";
import { useSelector } from "react-redux";
import { Badge, Drawer, Menu, Input } from "antd";

const { Search } = Input;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);

  // Calculate total items in cart
  const cartItemCount = cartItems?.cartItems?.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0;

  // Categories for navigation
  const categories = [
    { name: "Home", path: "/products" },
    { name: "Electronics", path: "/products?category=electronics" },
    { name: "Clothing", path: "/products?category=clothing" },
    { name: "Accessories", path: "/products?category=accessories" },
    { name: "New Arrivals", path: "/products?sort=newest" },
  ];

  return (
    <header className="header">
      <div className="container header__container">
        {/* Logo */}
        <Link to="/products" className="header__logo">
          Tanzayb
        </Link>

        {/* Mobile Menu Button - only visible on small screens */}
        <button
          className="md:hidden text-gray-700 hover:text-black"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars size={24} />
        </button>

        {/* Desktop Navigation - hidden on small screens */}
        <nav className="hidden md:flex items-center space-x-6">
          {categories.map((category) => (
            <NavLink
              key={category.name}
              to={category.path}
              className={({ isActive }) =>
                isActive
                  ? "header__nav-link active"
                  : "header__nav-link"
              }
            >
              {category.name}
            </NavLink>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="header__search hidden md:block">
          <Search
            placeholder="Search products..."
            allowClear
            className="w-full"
          />
        </div>

        {/* Action Icons */}
        <div className="header__actions">
          <NavLink to="/wishlist" className="header__nav-link hidden md:block">
            <FaHeart size={20} />
          </NavLink>

          <NavLink to="/products/cart" className="header__nav-link relative">
            <Badge count={cartItemCount} size="small" offset={[0, 0]}>
              <FaShoppingCart size={20} />
            </Badge>
          </NavLink>

          <div className="ml-4">
            <Profile />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="mb-4">
          <Search placeholder="Search products..." allowClear />
        </div>

        <Menu mode="vertical">
          {categories.map((category) => (
            <Menu.Item key={category.name}>
              <Link
                to={category.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item key="wishlist">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center"
            >
              <FaHeart className="mr-2" /> Wishlist
            </Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </header>
  );
};

export default Header;
