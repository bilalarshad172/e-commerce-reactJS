import React from 'react';
import { Table, Tag, Badge, Avatar, Progress, Button, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, ArrowUpOutlined, BarChartOutlined } from '@ant-design/icons';

// Mock data for top selling products
const productData = [
  {
    key: '1',
    name: 'Premium Wireless Headphones',
    image: 'https://placehold.co/40x40',
    price: 129.99,
    sold: 342,
    stock: 58,
    stockPercentage: 58,
    category: 'Electronics',
    status: 'In Stock',
    trend: 'up',
    trendPercentage: 12
  },
  {
    key: '2',
    name: 'Ergonomic Office Chair',
    image: 'https://placehold.co/40x40',
    price: 249.99,
    sold: 287,
    stock: 23,
    stockPercentage: 23,
    category: 'Furniture',
    status: 'Low Stock',
    trend: 'up',
    trendPercentage: 8
  },
  {
    key: '3',
    name: 'Smart Watch Series 5',
    image: 'https://placehold.co/40x40',
    price: 199.99,
    sold: 256,
    stock: 42,
    stockPercentage: 42,
    category: 'Electronics',
    status: 'In Stock',
    trend: 'up',
    trendPercentage: 15
  },
  {
    key: '4',
    name: 'Organic Cotton T-Shirt',
    image: 'https://placehold.co/40x40',
    price: 34.99,
    sold: 198,
    stock: 76,
    stockPercentage: 76,
    category: 'Clothing',
    status: 'In Stock',
    trend: 'down',
    trendPercentage: 3
  },
  {
    key: '5',
    name: 'Professional DSLR Camera',
    image: 'https://placehold.co/40x40',
    price: 899.99,
    sold: 156,
    stock: 12,
    stockPercentage: 12,
    category: 'Electronics',
    status: 'Low Stock',
    trend: 'up',
    trendPercentage: 5
  }
];

// Table columns configuration
const columns = [
  {
    title: 'Product',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div className="flex items-center">
        <Avatar src={record.image} size={40} shape="square" className="mr-3" />
        <div>
          <div className="font-medium text-gray-800">{text}</div>
          <div className="text-xs text-gray-500">{record.category}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (price) => (
      <span className="font-medium">${price.toFixed(2)}</span>
    ),
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: 'Sold',
    dataIndex: 'sold',
    key: 'sold',
    render: (sold, record) => (
      <div>
        <div className="font-medium">{sold}</div>
        <div className="flex items-center text-xs">
          {record.trend === 'up' ? (
            <>
              <ArrowUpOutlined className="text-green-500 mr-1" />
              <span className="text-green-500">+{record.trendPercentage}%</span>
            </>
          ) : (
            <>
              <ArrowUpOutlined className="text-red-500 mr-1 transform rotate-180" />
              <span className="text-red-500">-{record.trendPercentage}%</span>
            </>
          )}
        </div>
      </div>
    ),
    sorter: (a, b) => a.sold - b.sold,
    defaultSortOrder: 'descend',
  },
  {
    title: 'Stock',
    key: 'stock',
    dataIndex: 'stock',
    render: (stock, record) => (
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs">{stock} units</span>
          <span className="text-xs">{record.stockPercentage}%</span>
        </div>
        <Progress
          percent={record.stockPercentage}
          showInfo={false}
          strokeColor={
            record.stockPercentage > 50 ? "#24D2B5" :
            record.stockPercentage > 25 ? "#F9C851" : "#FF5C5C"
          }
          size="small"
        />
      </div>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (status) => {
      let color = status === 'In Stock' ? 'success' : 'warning';
      return (
        <Badge status={color} text={status} />
      );
    },
    filters: [
      { text: 'In Stock', value: 'In Stock' },
      { text: 'Low Stock', value: 'Low Stock' },
    ],
    onFilter: (value, record) => record.status.includes(value),
  },
  {
    title: 'Actions',
    key: 'action',
    render: () => (
      <div className="flex space-x-2">
        <Tooltip title="View Details">
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Tooltip>
        <Tooltip title="View Analytics">
          <Button type="text" icon={<BarChartOutlined />} size="small" />
        </Tooltip>
      </div>
    ),
  },
];

const TopSellers = () => {
  return (
    <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-white p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Top Selling Products</h3>
            <p className="text-sm text-gray-500">Best performing products by sales volume</p>
          </div>
          <Button type="primary" icon={<ShoppingCartOutlined />} className="bg-black hover:bg-gray-800">
            View All Products
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={productData}
          pagination={false}
          rowClassName="hover:bg-gray-50"
          className="border border-gray-100 rounded-lg"
          size="middle"
        />
      </div>
    </div>
  );
};

export default TopSellers;