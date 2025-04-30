import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { Layout, Typography, Avatar, Dropdown, Space, Badge } from "antd";
import { BellOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/authSlice";

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin101");
  };

  const items = [
    {
      key: '1',
      label: <span>Profile</span>,
    },
    {
      key: '2',
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout className="transition-all duration-300 ml-64">
        <Header className="bg-white shadow-sm px-6 flex justify-between items-center h-16 fixed w-full z-10">
          <div>
            <Title level={4} className="m-0">Admin Dashboard</Title>
          </div>
          <div className="flex items-center gap-4">
            <Badge count={5} size="small">
              <BellOutlined className="text-xl cursor-pointer hover:text-blue-500 transition-colors" />
            </Badge>
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="cursor-pointer">
                  <Avatar icon={<UserOutlined />} src={user?.photoURL} />
                  <span className="hidden md:inline">{user?.username || 'Admin'}</span>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6 mt-16 bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
