import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Typography, Tooltip, Card, Statistic, Row, Col } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  NodeIndexOutlined
} from "@ant-design/icons";
import { fetchCategories, deleteCategory } from "../../../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Categories = () => {
  const { categories, loading } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Count total categories and subcategories
  const [stats, setStats] = useState({
    totalCategories: 0,
    parentCategories: 0,
    subCategories: 0
  });

  const assignKeys = (list, parentKey = "") => {
    return list.map((category) => {
      const key = parentKey ? `${parentKey}-${category._id}` : category._id;
      // If children is null or undefined, treat it as an empty array
      const childArray = Array.isArray(category.children)
        ? category.children
        : [];

      return {
        ...category,
        key,
        children: childArray.length ? assignKeys(childArray, key) : undefined,
      };
    });
  };
  const dataSource = assignKeys(categories || []);

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex items-center">
          {record.parent ? (
            <NodeIndexOutlined className="mr-2 text-gray-500" />
          ) : (
            <BranchesOutlined className="mr-2 text-blue-500" />
          )}
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => (
        <div>
          {record.parent ? (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              Subcategory
            </span>
          ) : (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Parent
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "_id",
      align: "right",
      render: (_, record) => (
        <Space key={record._id}>
          <Tooltip title="Edit Category">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => handleEdit(record._id)}
              className="hover:bg-blue-50 transition-colors"
            />
          </Tooltip>
          <Tooltip title="Delete Category">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={() => handleDelete(record._id)}
              className="hover:bg-red-50 transition-colors"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Calculate stats when categories change
  useEffect(() => {
    if (categories) {
      // Count parent categories (those without a parent)
      const parentCats = categories.filter(cat => !cat.parent).length;

      // Count all subcategories
      let subCats = 0;
      const countSubcategories = (cats) => {
        cats.forEach(cat => {
          if (cat.children && cat.children.length) {
            subCats += cat.children.length;
            countSubcategories(cat.children);
          }
        });
      };

      countSubcategories(categories);

      setStats({
        totalCategories: parentCats + subCats,
        parentCategories: parentCats,
        subCategories: subCats
      });
    }
  }, [categories]);

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDelete = (id) => {
    Modal.confirm({
          title: "Are you sure you want to delete this Category?",
          icon: <ExclamationCircleOutlined />,
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            dispatch(deleteCategory(id))
              .then(() => {
                message.success("Category deleted successfully");
              })
              .catch((error) => {
                message.error("Failed to delete Category: " + error.message);
              });
          },
        });
  };
  return (
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Title level={3} className="m-0">Categories</Title>
              <Text type="secondary">Manage your product categories and subcategories</Text>
            </div>
            <NavLink
              to="/admin/categories/add"
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              <PlusOutlined className="mr-2" />
              Add Category
            </NavLink>
          </div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Total Categories</span>}
                  value={stats.totalCategories}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<AppstoreOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Parent Categories</span>}
                  value={stats.parentCategories}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<BranchesOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Subcategories</span>}
                  value={stats.subCategories}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<NodeIndexOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Table Section */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <Table
              rowKey={(record) => record.key}
              columns={columns}
              loading={loading}
              dataSource={dataSource}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              expandable={{
                expandRowByClick: true,
                rowExpandable: (record) => !!record.children,
              }}
              className="categories-table"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
