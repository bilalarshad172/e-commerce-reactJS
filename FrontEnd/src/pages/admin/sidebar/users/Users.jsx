import React, { useState, useEffect } from "react";
import { Table, Button, Space, Menu, Checkbox, Dropdown } from "antd";
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
    dataIndex: "username",
    key: "username",
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
    render: (phone) => phone?.fullPhoneNumber,
  },
  {
    title: "Country",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => phone?.isoCode,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const Users = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const [columns, setColumns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.map((col) => col.key)
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  console.log(users);
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
    <div className="container mx-auto px-4">
      <div className="border rounded-md shadow-md mt-5">
        <h3 className="text-2xl font-semibold mx-5 mt-5">Users</h3>
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
        <div className="mt-5 mx-5">
          <Table
            size="small"
            rowKey={(record) => record._id}
            columns={filteredColumns}
            dataSource={users}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
