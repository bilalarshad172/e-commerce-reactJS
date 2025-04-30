import React from "react";
import { Progress, Tooltip, Row, Col, Card, Statistic } from "antd";
import { UserOutlined, TeamOutlined, RiseOutlined, ShoppingOutlined } from '@ant-design/icons';

const UserChart = () => {
  // Mock data for user statistics
  const userStats = {
    totalUsers: 1245,
    newUsers: 128,
    activeUsers: 876,
    conversionRate: 68
  };

  return (
    <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-white p-5">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">User Statistics</h3>
          <p className="text-sm text-gray-500">User growth and engagement metrics</p>
        </div>

        {/* User Stats Cards */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col span={12}>
            <Card className="bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
              <Statistic
                title="Total Users"
                value={userStats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#000' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card className="bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
              <Statistic
                title="New Users"
                value={userStats.newUsers}
                prefix={<TeamOutlined />}
                suffix="this month"
                valueStyle={{ color: '#000' }}
              />
            </Card>
          </Col>
        </Row>

        {/* User Activity Chart */}
        <div className="text-center mt-6 mb-2">
          <h4 className="text-base font-medium text-gray-700 mb-3">User Engagement</h4>
          <div className="flex justify-center">
            <Tooltip title={`${userStats.activeUsers} active users (${userStats.conversionRate}% of total)`}>
              <Progress
                type="dashboard"
                percent={userStats.conversionRate}
                width={180}
                strokeColor={{
                  '0%': '#24D2B5',
                  '100%': '#20AEE3',
                }}
                strokeWidth={8}
                format={percent => (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{percent}%</div>
                    <div className="text-xs text-gray-500">Active Users</div>
                  </div>
                )}
              />
            </Tooltip>
          </div>
        </div>

        {/* User Growth Indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <RiseOutlined className="text-green-500 mr-1" />
            <span className="text-sm font-medium">12.5% growth</span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChart;
