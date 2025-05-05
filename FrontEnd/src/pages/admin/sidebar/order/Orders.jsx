import React, { useState, useEffect } from "react";
import { Table, Button, Space, Menu, Checkbox, Dropdown, Tag, Spin, message, Typography, Card, Statistic, Row, Col } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../../redux/orderSlice";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Processing":
      return "blue";
    case "Shipped":
      return "purple";
    case "Delivered":
      return "green";
    case "Cancelled":
      return "red";
    default:
      return "default";
  }
};

const getPaymentStatusColor = (isPaid) => {
  return isPaid ? "green" : "red";
};

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
    title: "Order ID",
    dataIndex: "_id",
    key: "Order_id",
    render: (id) => <span className="font-medium">{id.substring(0, 8)}...</span>,
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "date",
    render: (date) => new Date(date).toLocaleDateString(),
  },
  {
    title: "Customer",
    dataIndex: ["user", "username"],
    key: "customer",
  },
  {
    title: "Payment Status",
    dataIndex: "isPaid",
    key: "payment_status",
    render: (isPaid) => (
      <Tag color={getPaymentStatusColor(isPaid)}>
        {isPaid ? "Paid" : "Not Paid"}
      </Tag>
    ),
  },
  {
    title: "Order Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={getStatusColor(status)}>
        {status}
      </Tag>
    ),
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "payment_method",
  },
  {
    title: "Total",
    dataIndex: "totalPrice",
    key: "total",
    render: (price) => `₨ ${price}`,
  },
  {
    title: "Actions",
    key: "action",
    align: "right",
    render: (_, record) => (
      <Space>
        <NavLink
          to={`/admin/orders/${record._id}`}
          style={{
            color: "#1890ff",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <EyeOutlined style={{ marginRight: "4px" }} />
          View
        </NavLink>
      </Space>
    ),
  },
];

const { Title, Text } = Typography;

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [columns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.map((col) => col.key)
  );
  const [searchText, setSearchText] = useState("");

  // Order statistics
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Calculate order statistics when orders change
  useEffect(() => {
    if (orders && orders.length) {
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status === "Pending").length;
      const deliveredOrders = orders.filter(order => order.status === "Delivered").length;

      // Calculate total revenue from all orders
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      setOrderStats({
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue
      });
    }
  }, [orders]);

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

  // Filter orders based on search text
  const filteredOrders = orders?.filter((order) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    const orderId = order._id.toLowerCase();
    const customerName = order.user?.username?.toLowerCase() || "";

    return (
      orderId.includes(searchLower) ||
      customerName.includes(searchLower)
    );
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    dispatch(getAllOrders());
  };

  if (error) {
    message.error(error);
  }

  return (
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Title level={3} className="m-0">Orders</Title>
              <Text type="secondary">Manage and track customer orders</Text>
            </div>
          </div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Total Orders</span>}
                  value={orderStats.totalOrders}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Pending Orders</span>}
                  value={orderStats.pendingOrders}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Delivered Orders</span>}
                  value={orderStats.deliveredOrders}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Total Revenue</span>}
                  value={orderStats.totalRevenue}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<DollarOutlined />}
                  suffix="₨"
                />
              </Card>
            </Col>
          </Row>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-auto relative">
              <input
                type="text"
                className="border rounded-md py-2 px-4 pr-10 w-full md:w-64"
                placeholder="Search orders..."
                value={searchText}
                onChange={handleSearchChange}
              />
              <SearchOutlined className="absolute right-3 top-3 text-gray-400" />
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
                rowKey="_id"
                columns={filteredColumns}
                dataSource={filteredOrders || []}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                className="orders-table"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
