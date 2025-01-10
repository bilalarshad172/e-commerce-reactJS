import React, { useEffect } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { NavLink,useNavigate } from "react-router-dom";
import { fetchBrands, deleteBrand } from "../../../../redux/brandsSlice";
import { useDispatch, useSelector } from "react-redux";

const Brands = () => {
  const { brands, loading, error } = useSelector((state) => state.brands);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);
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
    navigate(`/admin/brands/edit/${id}`);
  };
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this brand?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        dispatch(deleteBrand(id))
          .then(() => {
            message.success("Brand deleted successfully");
          })
          .catch((error) => {
            message.error("Failed to delete brand: " + error.message);
          });
      },
    });
  };
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
        />
      </div>
    </div>
  );
};

export default Brands;
