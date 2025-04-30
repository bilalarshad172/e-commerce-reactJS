import React, { useState } from "react";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ShopOutlined,
  LogoutOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Tooltip, Divider, Button } from "antd";
import { logout } from "../../../redux/authSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin101");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/admin/dashboard",
      color: "blue"
    },
    {
      key: "products",
      icon: <ShoppingCartOutlined />,
      label: "Products",
      path: "/admin/products/table",
      color: "green"
    },
    {
      key: "categories",
      icon: <AppstoreOutlined />,
      label: "Categories",
      path: "/admin/categories",
      color: "teal"
    },
    {
      key: "brands",
      icon: <TagsOutlined />,
      label: "Brands",
      path: "/admin/brands",
      color: "yellow"
    },
    {
      key: "content",
      icon: <EditOutlined />,
      label: "Content",
      path: "/admin/content",
      color: "orange"
    },
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: "Orders",
      path: "/admin/orders",
      color: "purple"
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      path: "/admin/users",
      color: "pink"
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      path: "/admin/settings",
      color: "red"
    }
  ];

  return (
    <div className={`h-screen bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 z-10 overflow-y-auto`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center">
            <ShopOutlined className="text-2xl text-black mr-2" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg"
        />
      </div>

      <div className="py-4">
        <ul>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

            return (
              <li key={item.key} className="mb-2 px-4">
                <Tooltip title={collapsed ? item.label : ""} placement="right">
                  <NavLink
                    to={item.path}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                      ${isActive
                        ? `bg-${item.color}-50 text-${item.color}-600 font-medium`
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className={`text-xl ${isActive ? `text-${item.color}-500` : ''}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && isActive && (
                      <span className={`ml-auto h-2 w-2 rounded-full bg-${item.color}-500`}></span>
                    )}
                  </NavLink>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </div>

      <Divider className="my-2" />

      <div className="px-4 pb-4">
        <Tooltip title={collapsed ? "Logout" : ""} placement="right">
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className={`flex items-center gap-3 p-3 w-full justify-start hover:bg-red-50`}
          >
            {!collapsed && "Logout"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
