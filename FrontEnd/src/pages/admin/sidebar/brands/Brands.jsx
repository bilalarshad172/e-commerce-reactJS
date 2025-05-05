import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Typography, Tooltip, Card, Statistic, Row, Col } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  TagOutlined,
  ShopOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchBrands, deleteBrand } from "../../../../redux/brandsSlice";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

const Brands = () => {
  const { brands, loading } = useSelector((state) => state.brands);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Stats for brands
  const [stats, setStats] = useState({
    totalBrands: 0,
    recentBrands: 0,
    popularBrands: 0
  });

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  // Calculate stats when brands change
  useEffect(() => {
    if (brands && brands.length) {
      // Get total number of brands
      const totalBrands = brands.length;

      // Get brands created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentBrands = brands.filter(brand => {
        if (brand.createdAt) {
          const createdDate = new Date(brand.createdAt);
          return createdDate > thirtyDaysAgo;
        }
        return false;
      }).length;

      // For popular brands, we'll just use a placeholder since we don't have product counts
      // In a real app, you might count how many products use each brand
      const popularBrands = Math.min(3, totalBrands);

      setStats({
        totalBrands,
        recentBrands,
        popularBrands
      });
    }
  }, [brands]);
  const columns = [
    {
      title: "Brand Name",
      dataIndex: "title",
      key: "name",
      render: (text) => (
        <div className="flex items-center">
          <TagOutlined className="mr-2 text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Created",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (date) => (
        date ? (
          <span className="text-gray-600">
            {new Date(date).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-gray-400">Not available</span>
        )
      ),
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "_id",
      align: "right",
      render: (_, record) => (
        <Space key={record._id}>
          <Tooltip title="Edit Brand">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => handleEdit(record._id)}
              className="hover:bg-blue-50 transition-colors"
            />
          </Tooltip>
          <Tooltip title="Delete Brand">
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
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Title level={3} className="m-0">Brands</Title>
              <Text type="secondary">Manage your product brands</Text>
            </div>
            <NavLink
              to="/admin/brands/add"
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              <PlusOutlined className="mr-2" />
              Add Brand
            </NavLink>
          </div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Total Brands</span>}
                  value={stats.totalBrands}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<TagOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">New Brands (30 days)</span>}
                  value={stats.recentBrands}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<ShopOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Popular Brands</span>}
                  value={stats.popularBrands}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Table Section */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <Table
              columns={columns}
              loading={loading}
              dataSource={brands.map((brand) => ({ ...brand, key: brand._id }))}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              className="brands-table"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
