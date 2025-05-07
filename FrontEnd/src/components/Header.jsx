import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaHeart, FaBars } from "react-icons/fa";
import Profile from "./Profile";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Drawer, Menu, Input, message } from "antd";
import { fetchCategories } from "../redux/categorySlice";

const { Search } = Input;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { cartItems } = useSelector((state) => state.cart);
  const { categories: allCategories } = useSelector((state) => state.categories);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Calculate total items in cart
  const cartItemCount = cartItems?.cartItems?.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0;

  // Handle search
  const handleSearch = (value) => {
    if (!value || value.trim() === "") {
      message.info("Please enter a search term");
      return;
    }

    navigate(`/products/search?query=${encodeURIComponent(value)}`);
    setSearchTerm("");
  };

  // Get clothing and accessories categories if they exist
  const clothingCategory = allCategories?.find(cat =>
    cat.title.toLowerCase() === "clothing" ||
    cat.title.toLowerCase().includes("cloth")
  );

  const accessoriesCategory = allCategories?.find(cat =>
    cat.title.toLowerCase() === "accessories" ||
    cat.title.toLowerCase().includes("accessor")
  );

  // Categories for navigation
  const categories = [
    ...(clothingCategory ? [{ name: "Clothing", path: `/products/search?category=${clothingCategory._id}` }] : []),
    ...(accessoriesCategory ? [{ name: "Accessories", path: `/products/search?category=${accessoriesCategory._id}` }] : []),
    { name: "New Arrivals", path: "/products/search?sort=newest" },
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
          {/* Home link */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "header__nav-link active"
                : "header__nav-link"
            }
          >
            Home
          </NavLink>

          {/* Category links */}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            enterButton
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
          <Search
            placeholder="Search products..."
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(value) => {
              handleSearch(value);
              setMobileMenuOpen(false);
            }}
            enterButton
          />
        </div>

        <Menu mode="vertical">
          {/* Home link */}
          <Menu.Item key="home">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </Menu.Item>

          {/* Category navigation */}
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
