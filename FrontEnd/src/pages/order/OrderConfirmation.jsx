import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Result, Button, Spin, Divider } from "antd";
import { getOrderDetails } from "../../redux/orderSlice";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const OrderConfirmation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { orderDetails, loading, error } = useSelector((state) => state.orders);
  
  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);
  
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
          <Result
            status="error"
            title="Error Loading Order"
            subTitle={error}
            extra={[
              <Button key="home" className="bg-black text-white">
                <Link to="/">Go Home</Link>
              </Button>,
            ]}
          />
        </div>
        <Footer />
      </>
    );
  }
  
  if (!orderDetails) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Result
            status="warning"
            title="Order Not Found"
            subTitle="The order you're looking for doesn't exist or you don't have permission to view it."
            extra={[
              <Button key="home" className="bg-black text-white">
                <Link to="/">Go Home</Link>
              </Button>,
            ]}
          />
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Result
          status="success"
          title="Order Placed Successfully!"
          subTitle={`Order ID: ${orderDetails._id}`}
          extra={[
            <Button key="shop" className="bg-black text-white">
              <Link to="/products">Continue Shopping</Link>
            </Button>,
          ]}
        />
        
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><span className="font-medium">Name:</span> {orderDetails.shippingAddress.fullName}</p>
                  <p><span className="font-medium">Address:</span> {orderDetails.shippingAddress.address}</p>
                  <p><span className="font-medium">City:</span> {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
                  <p><span className="font-medium">Country:</span> {orderDetails.shippingAddress.country}</p>
                  <p><span className="font-medium">Phone:</span> {orderDetails.shippingAddress.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <p>Items:</p>
                    <p>₨ {orderDetails.itemsPrice}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Shipping:</p>
                    <p>₨ {orderDetails.shippingPrice}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Tax:</p>
                    <p>₨ {orderDetails.taxPrice}</p>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between font-bold">
                    <p>Total:</p>
                    <p>₨ {orderDetails.totalPrice}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Payment</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p><span className="font-medium">Method:</span> {orderDetails.paymentMethod}</p>
                    <p><span className="font-medium">Status:</span> {orderDetails.isPaid ? "Paid" : "Not Paid"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded">
                {orderDetails.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-4 pb-4 border-b last:border-b-0">
                    <div className="flex items-center">
                      <img
                        src={item.product.images?.[0] || "/default-product.jpg"}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p>₨ {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              A confirmation email has been sent to your email address.
            </p>
            <Button className="bg-black text-white">
              <Link to="/user/profile">View My Orders</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
