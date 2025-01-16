import React, { useState, useEffect } from "react";
import { Table, Button, Space, Menu, Checkbox, Dropdown } from "antd";
import { NavLink } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../../redux/productSlice";
import defaultImage from "../../../../assets/default.png";

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
    title: "Image",
    dataIndex: "images",
    key: "images",
    render: (_, record) => {
      const imageSrc = record.file?.link || defaultImage;

      // A small inline handler to replace the broken image with the default
      const handleImageError = (e) => {
        e.target.src = defaultImage;
      };

      return (
        <img
          src={imageSrc}
          alt={record.product_name}
          onError={handleImageError}
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      );
    },
  },
  {
    title: "Product Name",
    dataIndex: "title",
    key: "product_name",
  },
  {
    title: "Brand",
    dataIndex: ["brand", "title"],
    key: "brand",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Inventory",
    dataIndex: "countInStock",
    key: "inventory",
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
const ProductTable = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  console.log(products);
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
      <div className="border rounded-md shadow-md mt-5 ">
        <div className="flex justify-between items-center mx-5">
          <h3 className="text-2xl font-semibold">Products</h3>
          <NavLink
            to="/admin/products/add"
            className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white"
          >
            Add Products
          </NavLink>
        </div>
        <div className="flex justify-between items-center mt-5 mx-5">
          <div>
            <input
              type="text"
              className="border p-1 rounded-md"
              placeholder="Search Products"
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
            columns={filteredColumns}
            dataSource={products.map((product) => ({
              ...product,
              key: product._id,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
