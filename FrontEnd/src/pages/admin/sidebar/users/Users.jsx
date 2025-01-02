import React, { useState } from "react";
import { Table, Button, Space, Menu, Checkbox, Dropdown } from "antd";

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
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Orders",
    dataIndex: "orders",
    key: "orders",
  },
  {
    title: "Total Spent",
    dataIndex: "total_spent",
    key: "total_spent",
  },
  {
    title: "Last Activity",
    dataIndex: "last_activity",
    key: "last_activity",
  },
];


const data = [
  {
    key: "1",
    checkbox: false,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 123-456-7890",
    country: "United States",
    orders: 15,
    total_spent: "$1,200.00",
    last_activity: "2024-12-30",
  },
  {
    key: "2",
    checkbox: false,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+44 7700-900123",
    country: "United Kingdom",
    orders: 8,
    total_spent: "$950.00",
    last_activity: "2024-12-29",
  },
  {
    key: "3",
    checkbox: false,
    name: "Alice Johnson",
    email: "alicej@example.com",
    phone: "+91 98765-43210",
    country: "India",
    orders: 20,
    total_spent: "$2,150.00",
    last_activity: "2024-12-28",
  },
  {
    key: "4",
    checkbox: false,
    name: "Bob Williams",
    email: "bobwilliams@example.com",
    phone: "+61 400-123-456",
    country: "Australia",
    orders: 12,
    total_spent: "$1,000.00",
    last_activity: "2024-12-27",
  },
  {
    key: "5",
    checkbox: false,
    name: "Emma Brown",
    email: "emmabrown@example.com",
    phone: "+81 90-1234-5678",
    country: "Japan",
    orders: 10,
    total_spent: "$1,500.00",
    last_activity: "2024-12-26",
  },
  {
    key: "6",
    checkbox: false,
    name: "Michael Davis",
    email: "michaeld@example.com",
    phone: "+49 151-23456789",
    country: "Germany",
    orders: 5,
    total_spent: "$500.00",
    last_activity: "2024-12-25",
  },
];

const Users = () => {
  
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
          <h3 className="text-2xl font-semibold ml-5">Isers</h3>
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
  )
}

export default Users