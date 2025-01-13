import React, { useEffect } from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchCategories } from "../../../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const columns = [
  {
  title: "Name",
  dataIndex: "title",
  key: "title",
},
{
  title: "Actions",
  key: "actions",
  dataIndex: "_id",
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

const Categories = () => {
 const { categories, loading, error } = useSelector(
  (state) => state.categories
  );
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

const assignKeys = (list, parentKey = "") => {
  return list.map((category) => {
    const key = parentKey ? `${parentKey}-${category._id}` : category._id;
    // If children is null or undefined, treat it as an empty array
    const childArray = Array.isArray(category.children) ? category.children : [];

    return {
      ...category,
      key,
      children: childArray.length ? assignKeys(childArray, key) : undefined,
    };
  });
};

  const dataSource = assignKeys(categories || []);
  console.log(dataSource);
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="flex justify-between items-center mx-5">
        <div className=" mt-2 text-xl font-semibold">Categories</div>
        <div className="mt-4">
          <NavLink
            to="/admin/categories/add"
            className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white"
          >
            Add Categories
          </NavLink>
        </div>
      </div>

      <div className="mt-5">
        <Table
          rowKey={(record) => record.key}
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={true}
          expandable={{
            expandRowByClick: true, // Allows row expansion when clicking anywhere on the row
            rowExpandable: (record) => !!record.children, // Only expandable if there are children
          }}
          size="small"
        />
      </div>
    </div>
  );
};

export default Categories;
