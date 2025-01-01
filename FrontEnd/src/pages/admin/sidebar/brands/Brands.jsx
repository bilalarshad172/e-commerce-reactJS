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
    
  },
  {
    key: "4",
    name: "Winter Collection",
   
  },
];

const Brands = () => {
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="flex justify-between items-center mx-5">
        <div className=" mt-2 text-xl font-semibold">Brands</div>
        <div className="mt-4">
          <NavLink
            to="/admin/brands/add"
            className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white">
            Add Brands
          </NavLink>
        </div>
      </div>

      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
         
          bordered
        />
      </div>
    </div>
  );
};

export default Brands;
