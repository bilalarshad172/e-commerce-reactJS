import {
  DashboardOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
   AppstoreOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <ul>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 border-l-4 border-blue-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <DashboardOutlined />
          <span>Dashboard</span>
        </NavLink>
      </li>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/products/table"
          className={({ isActive }) =>
            isActive
              ? "text-green-500 border-l-4 border-green-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <ShoppingCartOutlined />
          <span>Products</span>
        </NavLink>
      </li>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "text-teal-500 border-l-4 border-teal-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <AppstoreOutlined />
          <span>Categories</span>
        </NavLink>
      </li>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/brands"
          className={({ isActive }) =>
            isActive
              ? "text-yellow-500 border-l-4 border-yellow-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <TagsOutlined />
          <span>Brands</span>
        </NavLink>
      </li>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/content"
          className={({ isActive }) =>
            isActive
              ? "text-orange-500 border-l-4 border-orange-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <EditOutlined />
          <span>Content Management</span>
        </NavLink>
      </li>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "text-purple-500 border-l-4 border-purple-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <FileTextOutlined />
          <span>Orders</span>
        </NavLink>
      </li>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 border-l-4 border-pink-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <UserOutlined />
          <span>Users</span>
        </NavLink>
      </li>
      <li className="p-4 border-b flex items-center gap-2">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            isActive
              ? "text-red-500 border-l-4 border-red-500 pl-2 flex items-center gap-2"
              : "text-gray-700 pl-2 flex items-center gap-2"
          }
        >
          <SettingOutlined />
          <span>Settings</span>
        </NavLink>
      </li>
    </ul>
  );
};

export default Sidebar;
