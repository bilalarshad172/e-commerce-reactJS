import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Steps, message, Select, Divider, Radio } from "antd";
import { getCart } from "../../redux/cartSlice";
import { createOrder } from "../../redux/orderSlice";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const { Step } = Steps;
const { Option } = Select;

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, status: cartStatus } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success, orderDetails } = useSelector((state) => state.orders);

  // Calculate prices
  const itemsPrice = cartItems?.cartItems?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  ) || 0;
  
  const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Free shipping for orders over 1000
  const taxPrice = Math.round(0.15 * itemsPrice); // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    // If order creation was successful, navigate to order confirmation
    if (success && orderDetails) {
      navigate(`/order/${orderDetails._id}`);
    }
  }, [success, orderDetails, navigate]);

  const handleShippingSubmit = (values) => {
    setShippingData(values);
    setCurrentStep(1);
  };

  const handlePaymentSubmit = () => {
    setCurrentStep(2);
  };

  const handlePlaceOrder = () => {
    if (!user) {
      message.error("Please log in to place an order");
      navigate("/");
      return;
    }

    // Prepare order items from cart
    const orderItems = cartItems.cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Create order object
    const orderData = {
      orderItems,
      shippingAddress: shippingData,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    // Dispatch create order action
    dispatch(createOrder(orderData));
  };

  // Render different steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            <Form
              layout="vertical"
              onFinish={handleShippingSubmit}
              initialValues={shippingData}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter your full name" }]}
                >
                  <Input placeholder="Enter your full name" className="py-2" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                  <Input placeholder="Enter your phone number" className="py-2" />
                </Form.Item>
              </div>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter your address" }]}
              >
                <Input placeholder="Enter your street address" className="py-2" />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: "Please enter your city" }]}
                >
                  <Input placeholder="Enter your city" className="py-2" />
                </Form.Item>

                <Form.Item
                  name="postalCode"
                  label="Postal Code"
                  rules={[{ required: true, message: "Please enter your postal code" }]}
                >
                  <Input placeholder="Enter your postal code" className="py-2" />
                </Form.Item>

                <Form.Item
                  name="country"
                  label="Country"
                  rules={[{ required: true, message: "Please select your country" }]}
                >
                  <Select placeholder="Select your country" className="py-2">
                    <Option value="Pakistan">Pakistan</Option>
                    <Option value="India">India</Option>
                    <Option value="USA">United States</Option>
                    <Option value="UK">United Kingdom</Option>
                    <Option value="Canada">Canada</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item className="mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-black text-white px-6 py-2 h-auto"
                >
                  Continue to Payment
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="mb-6">
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Radio value="Cash on Delivery" className="block mb-3 text-lg">
                  Cash on Delivery
                </Radio>
                <Radio value="Credit Card" className="block mb-3 text-lg" disabled>
                  Credit Card (Coming Soon)
                </Radio>
                <Radio value="PayPal" className="block mb-3 text-lg" disabled>
                  PayPal (Coming Soon)
                </Radio>
              </Radio.Group>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setCurrentStep(0)}
                className="border border-black text-black px-6 py-2 h-auto"
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                className="bg-black text-white px-6 py-2 h-auto"
              >
                Continue to Review
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Review Your Order</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Shipping Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><span className="font-medium">Name:</span> {shippingData.fullName}</p>
                <p><span className="font-medium">Address:</span> {shippingData.address}</p>
                <p><span className="font-medium">City:</span> {shippingData.city}, {shippingData.postalCode}</p>
                <p><span className="font-medium">Country:</span> {shippingData.country}</p>
                <p><span className="font-medium">Phone:</span> {shippingData.phone}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Payment Method</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p>{paymentMethod}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded">
                {cartItems?.cartItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 pb-2 border-b">
                    <div className="flex items-center">
                      <img
                        src={item.product.images?.[0] || "/default-product.jpg"}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p>₨ {item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <p>Items:</p>
                  <p>₨ {itemsPrice}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Shipping:</p>
                  <p>₨ {shippingPrice}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Tax:</p>
                  <p>₨ {taxPrice}</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>Total:</p>
                  <p>₨ {totalPrice}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => setCurrentStep(1)}
                className="border border-black text-black px-6 py-2 h-auto"
              >
                Back
              </Button>
              <Button
                onClick={handlePlaceOrder}
                loading={loading}
                className="bg-black text-white px-6 py-2 h-auto"
              >
                Place Order
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 text-red-500">
                Error: {error}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!cartItems || !cartItems.cartItems || cartItems.cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 h-auto"
            >
              Continue Shopping
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
        <div className="mb-8">
          <Steps current={currentStep} className="max-w-3xl mx-auto">
            <Step title="Shipping" />
            <Step title="Payment" />
            <Step title="Review" />
          </Steps>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderStep()}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <p>Items ({cartItems?.cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0}):</p>
                  <p>₨ {itemsPrice}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Shipping:</p>
                  <p>₨ {shippingPrice}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Tax:</p>
                  <p>₨ {taxPrice}</p>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <p>Total:</p>
                  <p>₨ {totalPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
