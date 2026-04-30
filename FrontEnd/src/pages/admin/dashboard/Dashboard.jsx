import React, { useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Progress, Button, Spin, Alert } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboardSummary } from "../../../redux/adminDashboardSlice";

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboardSummary());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminDashboardSummary());
  };

  const stats = {
    totalSales: summary?.totalSales || 0,
    salesGrowth: summary?.salesGrowth || 0,
    totalOrders: summary?.totalOrders || 0,
    ordersGrowth: summary?.ordersGrowth || 0,
    totalCustomers: summary?.totalCustomers || 0,
    customersGrowth: summary?.customersGrowth || 0,
    totalProducts: summary?.totalProducts || 0,
    lowStock: summary?.lowStockCount || 0,
  };

  if (loading && !summary) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert
          type="warning"
          showIcon
          className="mb-4"
          message="Could not load latest dashboard data"
          description={error}
        />
      )}

      {/* Welcome Section */}
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={2} className="m-0">Welcome to Dashboard</Title>
            <Text type="secondary">Here's what's happening with your store today.</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              className="bg-black hover:bg-gray-800"
              onClick={handleRefresh}
            >
              Refresh Data
            </Button>
          </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Sales</span>}
              value={stats.totalSales}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="PKR "
            />
            <div className="mt-2 flex items-center">
              <ArrowUpOutlined className="text-green-500 mr-1" />
              <span className="text-green-500">{stats.salesGrowth}%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
            <Progress
              percent={stats.salesGrowth}
              showInfo={false}
              strokeColor="#3f8600"
              className="mt-2"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Orders</span>}
              value={stats.totalOrders}
              valueStyle={{ color: stats.ordersGrowth >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={<ShoppingCartOutlined />}
            />
            <div className="mt-2 flex items-center">
              {stats.ordersGrowth >= 0 ? (
                <ArrowUpOutlined className="text-green-500 mr-1" />
              ) : (
                <ArrowDownOutlined className="text-red-500 mr-1" />
              )}
              <span className={stats.ordersGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(stats.ordersGrowth)}%
              </span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
            <Progress
              percent={Math.abs(stats.ordersGrowth)}
              showInfo={false}
              strokeColor={stats.ordersGrowth >= 0 ? "#3f8600" : "#cf1322"}
              className="mt-2"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Customers</span>}
              value={stats.totalCustomers}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
            />
            <div className="mt-2 flex items-center">
              <ArrowUpOutlined className="text-green-500 mr-1" />
              <span className="text-green-500">{stats.customersGrowth}%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
            <Progress
              percent={stats.customersGrowth}
              showInfo={false}
              strokeColor="#3f8600"
              className="mt-2"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Products</span>}
              value={stats.totalProducts}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingOutlined />}
            />
            <div className="mt-2 flex items-center">
              <span className="text-orange-500">{stats.lowStock}</span>
              <span className="text-gray-500 ml-2">products low in stock</span>
            </div>
            <Progress
              percent={(stats.lowStock / stats.totalProducts) * 100}
              showInfo={false}
              strokeColor="#faad14"
              className="mt-2"
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Sections */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Orders"
            extra={<Button type="link">View All</Button>}
            className="shadow-sm"
          >
            <div className="space-y-4">
              {(summary?.recentOrders || []).map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 border-b last:border-0">
                  <div>
                    <div className="font-medium">Order #{order._id?.slice(-6)}</div>
                    <div className="text-gray-500 text-sm">Customer: {order.user?.username || "Unknown"}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">PKR {order.totalPrice || 0}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 inline-block">
                      {order.status || "Pending"}
                    </div>
                  </div>
                </div>
              ))}
              {!summary?.recentOrders?.length && (
                <p className="text-gray-500">No recent orders found.</p>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Top Products"
            extra={<Button type="link">View All</Button>}
            className="shadow-sm"
          >
            <div className="space-y-4">
              {(summary?.topProducts || []).map((product) => (
                <div key={product._id} className="flex items-center p-2 border-b last:border-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
                  <div className="flex-grow">
                    <div className="font-medium">{product.title || "Product Name"}</div>
                    <div className="text-gray-500 text-sm">PKR {product.price || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{product.soldQuantity || 0} sold</div>
                  </div>
                </div>
              ))}
              {!summary?.topProducts?.length && (
                <p className="text-gray-500">No top product data available.</p>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard
