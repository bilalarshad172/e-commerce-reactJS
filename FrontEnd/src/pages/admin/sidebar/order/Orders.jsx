import React, { useState } from "react";
import { Table, Button, Space, Menu, Checkbox, Dropdown } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

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
    dataIndex: "Order_id",
    key: "Order_id",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Payment Status",
    dataIndex: "payment_status",
    key: "payment_status",
  },
  {
    title: "Fullfillment Status",
    dataIndex: "fullfillment_status",
    key: "fullfillment_status",
  },
  {
    title: "Payment Method",
    dataIndex: "payment_method",
    key: "payment_method",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
  {
    title: "Actions",
    key: "action",
    align: "right",
    render: (text, record) => (
      <Space>
        <NavLink
          to="/admin/orders/detail"
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

const data = [
  {
    key: "1",
    checkbox: false,
    Order_id: "ORD-001",
    date: "2024-01-01",
    customer: "John Doe",
    payment_status: "Paid",
    fullfillment_status: "Fulfilled",
    payment_method: "Credit Card",
    total: "$100.00",
  },
  {
    key: "2",
    checkbox: false,
    Order_id: "ORD-002",
    date: "2024-01-02",
    customer: "Jane Smith",
    payment_status: "Pending",
    fullfillment_status: "Pending",
    payment_method: "PayPal",
    total: "$200.00",
  },
  {
    key: "3",
    checkbox: false,
    Order_id: "ORD-003",
    date: "2024-01-03",
    customer: "Alice Johnson",
    payment_status: "Failed",
    fullfillment_status: "Not Fulfilled",
    payment_method: "Debit Card",
    total: "$150.00",
  },
  {
    key: "4",
    checkbox: false,
    Order_id: "ORD-004",
    date: "2024-01-04",
    customer: "Bob Williams",
    payment_status: "Paid",
    fullfillment_status: "Shipped",
    payment_method: "Apple Pay",
    total: "$250.00",
  },
  {
    key: "5",
    checkbox: false,
    Order_id: "ORD-005",
    date: "2024-01-05",
    customer: "Charlie Brown",
    payment_status: "Refunded",
    fullfillment_status: "Cancelled",
    payment_method: "Google Pay",
    total: "$75.00",
  },
];

const Orders = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.map((col) => col.key)
  );

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

  return (
    <div className="border rounded-md shadow-md mt-5">
      <h3 className="text-2xl font-semibold ml-5">Orders</h3>
      <div className="flex justify-between items-center mt-5 mx-5">
        <div>
          <input
            type="text"
            className="border p-1 rounded-md"
            placeholder="Search Users"
          />
        </div>
        <div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>Columns</Button>
          </Dropdown>
        </div>
      </div>
      <div className="mt-5">
        <Table size="small" columns={filteredColumns} dataSource={data} />
      </div>
    </div>
  );
};

export default Orders;
