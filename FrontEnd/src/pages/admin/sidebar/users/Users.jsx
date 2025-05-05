import React, { useState, useEffect } from "react";
import { Table, Button, Menu, Checkbox, Dropdown, Typography, Card, Statistic, Row, Col, Tag, Spin, Input } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../../redux/authSlice";

const initialColumns = [
  {
    title: (
      <input
        id="multiselect_products"
        type="checkbox"
        className="bulk-checkbox"
      />
    ),
    dataIndex: "checkbox",
    key: "checkbox",
    onCell: () => ({
      onClick: (e) => e.stopPropagation(), // Prevent row click when clicking on this cell
    }),
    render: () => (
      <input
        type="checkbox"
        name="product_id"
        onClick={(e) => e.stopPropagation()}
      />
    ),
  },
  {
    title: "Name",
    dataIndex: "username",
    key: "username",
    render: (username) => (
      <div className="flex items-center">
        <UserOutlined className="mr-2 text-blue-500" />
        <span className="font-medium">{username}</span>
      </div>
    ),
    sorter: (a, b) => a.username?.localeCompare(b.username),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email) => (
      <div className="flex items-center">
        <MailOutlined className="mr-2 text-gray-500" />
        <span>{email}</span>
      </div>
    ),
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => (
      <div className="flex items-center">
        <PhoneOutlined className="mr-2 text-gray-500" />
        <span>{phone?.fullPhoneNumber || "N/A"}</span>
      </div>
    ),
  },
  {
    title: "Country",
    dataIndex: "phone",
    key: "country",
    render: (phone) => (
      <div className="flex items-center">
        <GlobalOutlined className="mr-2 text-gray-500" />
        <span>{phone?.isoCode || "N/A"}</span>
      </div>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role) => (
      <Tag color={role === "admin" ? "blue" : "green"} className="px-3 py-1">
        {role || "user"}
      </Tag>
    ),
    filters: [
      { text: "Admin", value: "admin" },
      { text: "User", value: "user" },
    ],
    onFilter: (value, record) => record.role === value,
  },
];

const { Title, Text } = Typography;

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.auth);
  const [columns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.map((col) => col.key)
  );
  const [searchText, setSearchText] = useState("");

  // User statistics
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Calculate user statistics when users change
  useEffect(() => {
    if (users && users.length) {
      const totalUsers = users.length;
      const adminUsers = users.filter(user => user.role === "admin").length;
      const regularUsers = totalUsers - adminUsers;

      setUserStats({
        totalUsers,
        adminUsers,
        regularUsers
      });
    }
  }, [users]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    dispatch(getAllUsers());
  };

  const handleColumnToggle = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((columnKey) => columnKey !== key)
        : [...prev, key]
    );
  };

  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  const menu = (
    <Menu>
      {initialColumns.map((col) => (
        <Menu.Item key={col.key}>
          <Checkbox
            checked={visibleColumns.includes(col.key)}
            onChange={() => handleColumnToggle(col.key)}
          >
            {typeof col.title === "string" ? col.title : "Checkbox"}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );
  // Filter users based on search text
  const filteredUsers = users?.filter((user) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    const username = user.username?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";

    return (
      username.includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Title level={3} className="m-0">Users</Title>
              <Text type="secondary">Manage user accounts and permissions</Text>
            </div>
          </div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Total Users</span>}
                  value={userStats.totalUsers}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Admin Users</span>}
                  value={userStats.adminUsers}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Regular Users</span>}
                  value={userStats.regularUsers}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<UserAddOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-auto relative">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search users by name or email"
                value={searchText}
                onChange={handleSearchChange}
                className="w-full md:w-64"
                allowClear
              />
            </div>

            <div className="flex gap-2">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                className="border-black text-black hover:bg-gray-100"
              >
                Refresh
              </Button>
              <Dropdown menu={{ items: menu.items }} trigger={["click"]}>
                <Button className="border-black text-black hover:bg-gray-100">
                  <FilterOutlined className="mr-1" /> Columns
                </Button>
              </Dropdown>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                rowKey={(record) => record._id}
                columns={filteredColumns}
                dataSource={filteredUsers || []}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                className="users-table"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
