import React, { useEffect } from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { fetchBrands } from "../../../../redux/brandsSlice";
import { useDispatch, useSelector } from "react-redux";

const columns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "name",
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "_id", // Use `key` to uniquely identify rows
    align: "right",
    render: (text, record) => (
      <Space key={record._id}>
        <Button
          type="text"
          icon={<EditOutlined style={{ color: "#1890ff" }} />}
          onClick={() => handleEdit(record._id)}
        />
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onClick={() => handleDelete(record._id)}
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

const Brands = () => {
  const { brands, loading, error } = useSelector((state) => state.brands);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="flex justify-between items-center mx-5">
        <div className=" mt-2 text-xl font-semibold">Brands</div>
        <div className="mt-4">
          <NavLink
            to="/admin/brands/add"
            className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white"
          >
            Add Brands
          </NavLink>
        </div>
      </div>

      <div className="mt-5">
        <Table
          columns={columns}
          loading={loading}
          dataSource={brands.map((brand) => ({ ...brand, key: brand._id }))}
          pagination={false}
          size="small"
          bordered
        />
      </div>
    </div>
  );
};

export default Brands;
