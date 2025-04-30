import React, { useState, useEffect } from "react";
import { Table, Button, Space, Menu, Checkbox, Dropdown, Tag, Spin, message } from "antd";
import { EyeOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../../../redux/orderSlice";

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
    onCell: (record) => ({
      onClick: (e) => e.stopPropagation(), // Prevent row click when clicking on this cell
    }),
    render: (text, record) => (
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

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [columns, setColumns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.map((col) => col.key)
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

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
    <div className="bg-white rounded-lg shadow-md mt-5 overflow-hidden">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      <div className="p-6">
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
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button className="border-black text-black hover:bg-gray-100">
                Columns
              </Button>
            </Dropdown>
          </div>
        </div>

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
            }}
            className="border rounded-lg overflow-hidden"
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
