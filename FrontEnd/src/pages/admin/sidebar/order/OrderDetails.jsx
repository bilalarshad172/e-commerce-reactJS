import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Spin,
  Tag,
  Divider,
  Button,
  Select,
  message,
  Modal,
  Result,
  Typography,
  Card,
  Timeline,
  Badge,
  Tooltip
} from "antd";
import {
  MobileOutlined,
  MailOutlined,
  UserOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { getOrderDetails, updateOrderStatus } from "../../../../redux/orderSlice";

const { Option } = Select;
const { Title, Text } = Typography;

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderDetails, loading, error } = useSelector((state) => state.orders);
  const [status, setStatus] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (orderDetails) {
      setStatus(orderDetails.status);
    }
  }, [orderDetails]);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const showUpdateModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateStatus = () => {
    dispatch(updateOrderStatus({ orderId: id, status }))
      .unwrap()
      .then(() => {
        message.success(`Order status updated to ${status}`);
        setIsModalVisible(false);
      })
      .catch((err) => {
        message.error(`Failed to update status: ${err}`);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Processing":
        return "blue";
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

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Error Loading Order"
        subTitle={error}
        extra={[
          <Button
            key="back"
            onClick={() => navigate("/admin/orders")}
            className="bg-black text-white"
          >
            Back to Orders
          </Button>,
        ]}
      />
    );
  }

  if (!orderDetails) {
    return (
      <Result
        status="warning"
        title="Order Not Found"
        subTitle="The order you're looking for doesn't exist or you don't have permission to view it."
        extra={[
          <Button
            key="back"
            onClick={() => navigate("/admin/orders")}
            className="bg-black text-white"
          >
            Back to Orders
          </Button>,
        ]}
      />
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header with back button and status */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/orders")}
                className="mb-4 border-black text-black hover:bg-gray-100"
              >
                Back to Orders
              </Button>
              <Title level={3} className="m-0">Order #{orderDetails._id.substring(0, 8)}</Title>
              <Text type="secondary">
                Placed on {new Date(orderDetails.createdAt).toLocaleString()}
              </Text>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0">
              <div className="mb-2">
                <Tag color={getStatusColor(orderDetails.status)} className="text-base px-3 py-1">
                  {orderDetails.status}
                </Tag>
                <Tag color={orderDetails.isPaid ? "green" : "red"} className="text-base px-3 py-1 ml-2">
                  {orderDetails.isPaid ? "Paid" : "Not Paid"}
                </Tag>
              </div>
              <Button
                type="primary"
                onClick={showUpdateModal}
                className="bg-black text-white hover:bg-gray-800"
              >
                Update Status
              </Button>
            </div>
          </div>

          {/* Order Timeline */}
          <Card className="mb-6 shadow-sm">
            <Title level={5}>Order Status Timeline</Title>
            <Timeline
              mode="left"
              items={[
                {
                  color: 'blue',
                  label: new Date(orderDetails.createdAt).toLocaleString(),
                  children: (
                    <div>
                      <Badge status="processing" text={<Text strong>Order Placed</Text>} />
                      <div>Customer placed the order</div>
                    </div>
                  ),
                },
                {
                  color: orderDetails.status === 'Pending' ? 'gray' : 'orange',
                  label: orderDetails.status !== 'Pending' ? new Date(orderDetails.updatedAt).toLocaleString() : '',
                  children: (
                    <div>
                      <Badge status={orderDetails.status !== 'Pending' ? 'success' : 'default'} text={<Text strong>Processing</Text>} />
                      <div>Order is being processed</div>
                    </div>
                  ),
                },
                {
                  color: orderDetails.status === 'Shipped' || orderDetails.status === 'Delivered' ? 'purple' : 'gray',
                  label: orderDetails.status === 'Shipped' || orderDetails.status === 'Delivered' ? new Date(orderDetails.updatedAt).toLocaleString() : '',
                  children: (
                    <div>
                      <Badge status={orderDetails.status === 'Shipped' || orderDetails.status === 'Delivered' ? 'success' : 'default'} text={<Text strong>Shipped</Text>} />
                      <div>Order has been shipped</div>
                    </div>
                  ),
                },
                {
                  color: orderDetails.status === 'Delivered' ? 'green' : 'gray',
                  label: orderDetails.status === 'Delivered' ? new Date(orderDetails.updatedAt).toLocaleString() : '',
                  children: (
                    <div>
                      <Badge status={orderDetails.status === 'Delivered' ? 'success' : 'default'} text={<Text strong>Delivered</Text>} />
                      <div>Order has been delivered</div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <Card
                title={<div className="flex items-center"><ShoppingOutlined className="mr-2" /> Order Items</div>}
                className="shadow-sm"
              >
                <div className="divide-y">
                  {orderDetails.orderItems.map((item, index) => (
                    <div key={index} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex items-center mb-4 md:mb-0">
                        <img
                          src={item.product.images?.[0] || "https://via.placeholder.com/80"}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded mr-4 border"
                        />
                        <div>
                          <Text strong>{item.product.title}</Text>
                          <div className="text-gray-500">₨ {item.price} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Text strong className="text-lg">₨ {item.price * item.quantity}</Text>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <Text>Subtotal</Text>
                    <Text>₨ {orderDetails.itemsPrice}</Text>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Text>Shipping</Text>
                    <Text>₨ {orderDetails.shippingPrice}</Text>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Text>Tax</Text>
                    <Text>₨ {orderDetails.taxPrice}</Text>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between">
                    <Text strong className="text-lg">Total</Text>
                    <Text strong className="text-lg">₨ {orderDetails.totalPrice}</Text>
                  </div>
                </div>
              </Card>
            </div>

            {/* Customer and Shipping Info */}
            <div className="lg:col-span-1">
              <Card
                title={<div className="flex items-center"><UserOutlined className="mr-2" /> Customer Information</div>}
                className="shadow-sm mb-6"
              >
                <div className="flex items-start mb-4">
                  <div>
                    <Text strong className="block mb-1">{orderDetails.user?.username || "Customer"}</Text>
                    <div className="text-gray-500 flex items-center mb-1">
                      <MailOutlined className="mr-1" /> {orderDetails.user?.email || "N/A"}
                    </div>
                    {orderDetails.shippingAddress?.phone && (
                      <div className="text-gray-500 flex items-center">
                        <MobileOutlined className="mr-1" /> {orderDetails.shippingAddress.phone}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card
                title={<div className="flex items-center"><HomeOutlined className="mr-2" /> Shipping Information</div>}
                className="shadow-sm"
              >
                <div className="mb-4">
                  <Text strong className="block mb-1">{orderDetails.shippingAddress?.fullName}</Text>
                  <div className="text-gray-500">
                    {orderDetails.shippingAddress?.address},<br />
                    {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.postalCode}<br />
                    {orderDetails.shippingAddress?.country}
                  </div>
                </div>

                <Divider className="my-3" />

                <div>
                  <Text strong className="block mb-1">Payment Method</Text>
                  <div className="flex items-center">
                    <DollarOutlined className="mr-2 text-green-600" />
                    <Text>{orderDetails.paymentMethod}</Text>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<div className="flex items-center"><ClockCircleOutlined className="mr-2" /> Update Order Status</div>}
        open={isModalVisible}
        onCancel={handleCancel}
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpdateStatus}
            className="bg-black text-white hover:bg-gray-800"
            icon={<CheckCircleOutlined />}
          >
            Update Status
          </Button>,
        ]}
      >
        <div className="mb-6">
          <Text strong className="block mb-2">Current Status:</Text>
          <Tag color={getStatusColor(orderDetails.status)} className="text-base px-3 py-1">
            {orderDetails.status}
          </Tag>
        </div>

        <div>
          <Text strong className="block mb-2">New Status:</Text>
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: '100%' }}
            size="large"
            className="mb-4"
          >
            <Option value="Pending">
              <div className="flex items-center">
                <Badge status="warning" />
                <span className="ml-2">Pending</span>
              </div>
            </Option>
            <Option value="Processing">
              <div className="flex items-center">
                <Badge status="processing" />
                <span className="ml-2">Processing</span>
              </div>
            </Option>
            <Option value="Shipped">
              <div className="flex items-center">
                <Badge status="purple" />
                <span className="ml-2">Shipped</span>
              </div>
            </Option>
            <Option value="Delivered">
              <div className="flex items-center">
                <Badge status="success" />
                <span className="ml-2">Delivered</span>
              </div>
            </Option>
            <Option value="Cancelled">
              <div className="flex items-center">
                <Badge status="error" />
                <span className="ml-2">Cancelled</span>
              </div>
            </Option>
          </Select>

          <Text type="secondary">
            Changing the order status will notify the customer about the update.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetails;
