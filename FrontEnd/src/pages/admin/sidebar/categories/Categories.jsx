import React from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "key", // Use `key` to uniquely identify rows
    align: "right",
    render: (text, record) => (
      <Space>
        <Button
          type="text"
          icon={<EditOutlined style={{ color: "#1890ff" }} />}
          onClick={() => handleEdit(record.key)}
        />
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onClick={() => handleDelete(record.key)}
        />
      </Space>
    ),
  },
];

const handleEdit = (id) => {
  console.log("Edit category with ID:", id);
};

const handleDelete = (id) => {
  console.log("Delete category with ID:", id);
};

const data = [
  {
    key: "1",
    name: "Summer Collection",
    children: [
      {
        key: "2",
        name: "Shirt",
      },
      {
        key: "3",
        name: "Trousers",
      },
    ],
  },
  {
    key: "4",
    name: "Winter Collection",
    children: [
      {
        key: "5",
        name: "Jacket",
      },
      {
        key: "6",
        name: "Sweater",
      },
    ],
  },
];

const Categories = () => {
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="flex justify-between items-center mx-5">
        <div className=" mt-2 text-xl font-semibold">Categories</div>
        <div className="mt-4">
          <NavLink
            to="/admin/categories/add"
            className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white">
            Add Categories
          </NavLink>
        </div>
      </div>

      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          expandable={{
            expandRowByClick: true, // Allows row expansion when clicking anywhere on the row
            rowExpandable: (record) => !!record.children, // Only expandable if there are children
          }}
          bordered
        />
      </div>
    </div>
  );
};

export default Categories;
