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
  Result
} from "antd";
import {
  MobileOutlined,
  MailOutlined,
  UserOutlined,
  HomeOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { getOrderDetails, updateOrderStatus } from "../../../../redux/orderSlice";

const { Option } = Select;

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/orders")}
            className="mb-4 border-black text-black hover:bg-gray-100"
          >
            Back to Orders
          </Button>
          <h1 className="text-2xl font-bold">Order #{orderDetails._id.substring(0, 8)}</h1>
          <p className="text-gray-600">
            Placed on {new Date(orderDetails.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end">
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

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>

              <div className="divide-y">
                {orderDetails.orderItems.map((item, index) => (
                  <div key={index} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={item.product.images?.[0] || "https://via.placeholder.com/80"}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-gray-500">₨ {item.price} × {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₨ {item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₨ {orderDetails.itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>₨ {orderDetails.shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>₨ {orderDetails.taxPrice}</span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₨ {orderDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Customer Information</h2>
              </div>

              <div className="p-4">
                <div className="flex items-start mb-4">
                  <UserOutlined className="mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">{orderDetails.user?.username || "Customer"}</h3>
                    <p className="text-gray-500 flex items-center">
                      <MailOutlined className="mr-1" /> {orderDetails.user?.email || "N/A"}
                    </p>
                    {orderDetails.shippingAddress?.phone && (
                      <p className="text-gray-500 flex items-center">
                        <MobileOutlined className="mr-1" /> {orderDetails.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>

              <div className="p-4">
                <div className="flex items-start">
                  <HomeOutlined className="mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium">{orderDetails.shippingAddress?.fullName}</h3>
                    <p className="text-gray-500">
                      {orderDetails.shippingAddress?.address},<br />
                      {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.postalCode}<br />
                      {orderDetails.shippingAddress?.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p>{orderDetails.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Update Order Status"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpdateStatus}
            className="bg-black text-white"
          >
            Update
          </Button>,
        ]}
      >
        <p className="mb-4">Current Status: <Tag color={getStatusColor(orderDetails.status)}>{orderDetails.status}</Tag></p>
        <Select
          value={status}
          onChange={handleStatusChange}
          style={{ width: '100%' }}
          className="mb-4"
        >
          <Option value="Pending">Pending</Option>
          <Option value="Processing">Processing</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default OrderDetails;
