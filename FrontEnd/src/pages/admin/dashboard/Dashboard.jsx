import React from 'react';
import { Typography, Row, Col, Card, Statistic, Progress, Tabs, Button } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import UserChart from "./components/UserChart";
import SalesCard from "./components/SalesCard";
import TopSellers from "./components/TopSellers";
import ReviewChart from "./components/ReviewChart";
import Overview from "./components/Overview";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  // Mock data for demonstration
  const stats = {
    totalSales: 15680,
    salesGrowth: 12.5,
    totalOrders: 256,
    ordersGrowth: -3.8,
    totalCustomers: 1245,
    customersGrowth: 8.2,
    totalProducts: 432,
    lowStock: 15
  };

  return (
    <div>
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
              prefix={<DollarOutlined />}
              suffix="$"
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

      {/* Charts Section */}
      <Tabs defaultActiveKey="1" className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <TabPane tab="Overview" key="1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Overview />
            </div>
            <div className="lg:col-span-1">
              <UserChart />
            </div>
          </div>
        </TabPane>
        <TabPane tab="Sales" key="2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SalesCard title="Today's Sales" value="1,250" icon={<DollarOutlined />} color="green" />
            </div>
            <div className="lg:col-span-1">
              <SalesCard title="Weekly Sales" value="8,970" icon={<DollarOutlined />} color="blue" />
            </div>
            <div className="lg:col-span-1">
              <SalesCard title="Monthly Sales" value="32,450" icon={<DollarOutlined />} color="purple" />
            </div>
          </div>
        </TabPane>
        <TabPane tab="Products" key="3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TopSellers />
            </div>
            <div className="lg:col-span-1">
              <ReviewChart />
            </div>
          </div>
        </TabPane>
      </Tabs>

      {/* Additional Sections */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Orders"
            extra={<Button type="link">View All</Button>}
            className="shadow-sm"
          >
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(item => (
                <div key={item} className="flex justify-between items-center p-3 border-b last:border-0">
                  <div>
                    <div className="font-medium">Order #{Math.floor(Math.random() * 10000)}</div>
                    <div className="text-gray-500 text-sm">Customer: John Doe</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${Math.floor(Math.random() * 500)}.00</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 inline-block">Completed</div>
                  </div>
                </div>
              ))}
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
              {[1, 2, 3, 4, 5].map(item => (
                <div key={item} className="flex items-center p-2 border-b last:border-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
                  <div className="flex-grow">
                    <div className="font-medium">Product Name</div>
                    <div className="text-gray-500 text-sm">${Math.floor(Math.random() * 100)}.00</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{Math.floor(Math.random() * 100)} sold</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard