import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders, getOrderDetails } from "../../redux/orderSlice";
import { Table, Tag, Button, Spin, Empty, Modal, Descriptions, Divider, List, Image } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import defaultImage from "../../assets/default.png";
import { EyeOutlined, ShoppingOutlined } from "@ant-design/icons";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userOrders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch user orders when component mounts
    dispatch(getUserOrders());
  }, [dispatch]);

  // Handle view order details
  const handleViewOrder = (orderId) => {
    dispatch(getOrderDetails(orderId))
      .unwrap()
      .then((result) => {
        setSelectedOrder(result.order);
        setModalVisible(true);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "blue";
      case "Processing":
        return "orange";
      case "Shipped":
        return "purple";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Table columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <span className="font-mono text-xs">{id.substring(id.length - 8)}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `₨ ${price}`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Processing", value: "Processing" },
        { text: "Shipped", value: "Shipped" },
        { text: "Delivered", value: "Delivered" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Payment",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid) => (
        <Tag color={isPaid ? "green" : "red"}>
          {isPaid ? "Paid" : "Not Paid"}
        </Tag>
      ),
      filters: [
        { text: "Paid", value: true },
        { text: "Not Paid", value: false },
      ],
      onFilter: (value, record) => record.isPaid === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record._id)}
          className="border-black text-black hover:bg-gray-100"
        >
          Details
        </Button>
      ),
    },
  ];

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Spin size="large" />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Error Loading Orders</h2>
            <p className="mb-4">{error}</p>
            <Button
              onClick={() => dispatch(getUserOrders())}
              className="bg-black text-white hover:bg-gray-800"
            >
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!userOrders || userOrders.length === 0) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="You haven't placed any orders yet"
            />
            <Button
              icon={<ShoppingOutlined />}
              onClick={() => navigate("/products")}
              className="mt-4 bg-black text-white hover:bg-gray-800"
            >
              Start Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-gray-600">
              View and track your order history
            </p>
          </div>

          <div className="p-6">
            <Table
              dataSource={userOrders}
              columns={columns}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
              }}
            />
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        title={
          <div className="text-lg font-bold">
            Order Details
            <span className="ml-2 font-mono text-sm text-gray-500">
              {selectedOrder?._id}
            </span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div className="order-details">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Order Date" span={2}>
                {formatDate(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                <Tag color={selectedOrder.isPaid ? "green" : "red"}>
                  {selectedOrder.isPaid ? "Paid" : "Not Paid"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Date" span={2}>
                {selectedOrder.isPaid
                  ? formatDate(selectedOrder.paidAt)
                  : "Not paid yet"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery" span={2}>
                <Tag color={selectedOrder.isDelivered ? "green" : "blue"}>
                  {selectedOrder.isDelivered ? "Delivered" : "Not Delivered"}
                </Tag>
                {selectedOrder.isDelivered && (
                  <span className="ml-2">
                    on {formatDate(selectedOrder.deliveredAt)}
                  </span>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Shipping Address</Divider>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">
                {selectedOrder.shippingAddress.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedOrder.shippingAddress.address}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {selectedOrder.shippingAddress.city}
              </Descriptions.Item>
              <Descriptions.Item label="Postal Code">
                {selectedOrder.shippingAddress.postalCode}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {selectedOrder.shippingAddress.country}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedOrder.shippingAddress.phone}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Order Items</Divider>
            <List
              itemLayout="horizontal"
              dataSource={selectedOrder.orderItems}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex w-full items-center">
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0] || defaultImage}
                        alt={item.product?.title}
                        onError={handleImageError}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                        preview={false}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.product?.title}</h4>
                      <p className="text-gray-500">
                        {item.quantity} x ₨ {item.price} = ₨{" "}
                        {item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                </List.Item>
              )}
            />

            <Divider orientation="left">Order Summary</Divider>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Items Price">
                ₨ {selectedOrder.itemsPrice}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping">
                ₨ {selectedOrder.shippingPrice}
              </Descriptions.Item>
              <Descriptions.Item label="Tax">
                ₨ {selectedOrder.taxPrice}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                <span className="text-lg font-bold">
                  ₨ {selectedOrder.totalPrice}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
};

export default OrderHistory;
