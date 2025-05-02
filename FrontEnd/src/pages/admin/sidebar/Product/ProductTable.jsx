import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Checkbox,
  message,
  Dropdown,
  Modal,
  Input,
  Tag,
  Tooltip,
  Badge,
  Avatar,
  Typography,
  Progress
} from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
  SettingOutlined,
  ShoppingOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../../../redux/productSlice";
import defaultImage from "../../../../assets/default.png";

const { Title, Text } = Typography;

const ProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.products);
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
      onCell: () => ({
        onClick: (e) => e.stopPropagation(), // Prevent row click when clicking on this cell
      }),
      render: () => (
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
        const imageSrc = record.images?.[0] || defaultImage;

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
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
      render: (_, record) => (
        <Space key={record._id}>
          {/* <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => handleEdit(record._id)}
          /> */}
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Create menu items for column visibility toggle
  const menu = {
    items: initialColumns.map((col) => ({
      key: col.key,
      label: (
        <Checkbox
          checked={visibleColumns.includes(col.key)}
          onChange={() => handleColumnToggle(col.key)}
        >
          {typeof col.title === "string" ? col.title : "Checkbox"}
        </Checkbox>
      )
    }))
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Product?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        dispatch(deleteProduct(id))
          .then(() => {
            message.success("Product deleted successfully");
          })
          .catch((error) => {
            message.error("Failed to delete Product: " + error.message);
          });
      },
    });
  };

  const handleRowClick = (record) => {
    navigate(`/admin/products/${record._id}/edit`);
  };

  // Function to get stock status
  const getStockStatus = (stock) => {
    if (stock <= 0) return { status: 'Out of Stock', color: 'error' };
    if (stock < 10) return { status: 'Low Stock', color: 'warning' };
    return { status: 'In Stock', color: 'success' };
  };

  // Enhanced columns with better styling
  const enhancedColumns = [
    {
      title: (
        <Checkbox
          id="multiselect_products"
          className="bulk-checkbox"
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      width: 50,
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
      render: () => (
        <Checkbox
          name="product_id"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      title: "Product",
      key: "product",
      render: (_, record) => {
        const imageSrc = record.images?.[0] || defaultImage;

        return (
          <div className="flex items-center">
            <Avatar
              src={imageSrc}
              alt={record.title}
              size={50}
              shape="square"
              className="mr-3"
              onError={(e) => { e.target.src = defaultImage; }}
            />
            <div>
              <div className="font-medium text-gray-800">{record.title}</div>
              <div className="text-xs text-gray-500">
                {record.category?.map(cat => cat.title).join(', ') || 'Uncategorized'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Brand",
      dataIndex: ["brand", "title"],
      key: "brand",
      render: (text) => (
        <Tag color="blue">{text || 'No Brand'}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <div className="font-medium">
          <DollarOutlined className="mr-1 text-green-600" />
          ${Number(price).toFixed(2)}
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Inventory",
      dataIndex: "countInStock",
      key: "inventory",
      render: (stock) => {
        const { status, color } = getStockStatus(stock);
        const percentage = Math.min(100, (stock / 100) * 100);

        return (
          <div>
            <div className="flex justify-between mb-1">
              <Badge status={color} text={status} />
              <span className="text-xs font-medium">{stock} units</span>
            </div>
            <Progress
              percent={percentage}
              size="small"
              showInfo={false}
              strokeColor={
                stock > 20 ? "#52c41a" :
                stock > 5 ? "#faad14" : "#ff4d4f"
              }
            />
          </div>
        );
      },
      sorter: (a, b) => a.countInStock - b.countInStock,
      filters: [
        { text: 'In Stock', value: 'in' },
        { text: 'Low Stock', value: 'low' },
        { text: 'Out of Stock', value: 'out' },
      ],
      onFilter: (value, record) => {
        if (value === 'in') return record.countInStock > 10;
        if (value === 'low') return record.countInStock > 0 && record.countInStock <= 10;
        if (value === 'out') return record.countInStock <= 0;
        return true;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "right",
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
      render: (_, record) => (
        <Space key={record._id}>
          <Tooltip title="Edit Product">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => navigate(`/admin/products/${record._id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#52c41a" }} />}
              onClick={() => window.open(`/products/${record._id}`, '_blank')}
            />
          </Tooltip>
          <Tooltip title="Delete Product">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered products based on search
  const filteredProducts = products ? products.filter(product =>
    (product.title ? product.title.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (product.brand?.title ? product.brand.title.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  ) : [];

  return (
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Title level={3} className="m-0">Products</Title>
              <Text type="secondary">Manage your product inventory</Text>
            </div>
            <NavLink
              to="/admin/products/add"
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              <PlusOutlined className="mr-2" />
              Add Product
            </NavLink>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Dropdown menu={{ items: menu }} trigger={["click"]}>
                <Button icon={<SettingOutlined />}>
                  Columns
                </Button>
              </Dropdown>
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: 'All Products' },
                    { key: '2', label: 'In Stock' },
                    { key: '3', label: 'Low Stock' },
                    { key: '4', label: 'Out of Stock' }
                  ]
                }}
                trigger={["click"]}
              >
                <Button icon={<FilterOutlined />}>
                  Filter
                </Button>
              </Dropdown>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <ShoppingOutlined className="text-blue-500 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Products</div>
                  <div className="text-xl font-bold">{products.length}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <ShoppingOutlined className="text-green-500 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">In Stock</div>
                  <div className="text-xl font-bold">
                    {products.filter(p => p.countInStock > 10).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 mr-3">
                  <ShoppingOutlined className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Low Stock</div>
                  <div className="text-xl font-bold">
                    {products.filter(p => p.countInStock > 0 && p.countInStock <= 10).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100 mr-3">
                  <ShoppingOutlined className="text-red-500 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Out of Stock</div>
                  <div className="text-xl font-bold">
                    {products.filter(p => p.countInStock <= 0).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <Table
              rowKey={(record) => record._id}
              columns={enhancedColumns}
              dataSource={filteredProducts.map((product) => ({
                ...product,
                key: product._id,
              }))}
              loading={loading}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: { cursor: "pointer" },
              })}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              className="product-table"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
