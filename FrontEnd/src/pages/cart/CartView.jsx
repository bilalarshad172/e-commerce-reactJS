import React, { useEffect } from "react";
import { Table, Button, Empty, Spin, Divider, message, InputNumber, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart, updateCart } from "../../redux/cartSlice";
import defaultImage from "../../assets/default.png";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { DeleteOutlined, ShoppingOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

const CartView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Calculate totals
  const itemsPrice = cartItems?.cartItems?.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  ) || 0;

  const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Free shipping for orders over 1000
  const taxPrice = Math.round(0.15 * itemsPrice); // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const dataSource = (cartItems?.cartItems || []).map((item, index) => ({
    key: index.toString(),
    ...item, // Spread item to include product and quantity
  }));
  // Handle removing an item from the cart
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }))
      .unwrap()
      .then(() => {
        message.success("Item removed from cart");
      })
      .catch((error) => {
        message.error(`Failed to remove item: ${error}`);
      });
  };

  // Handle updating item quantity
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    dispatch(updateCart({ cartItems: [{ product: productId, quantity }] }))
      .unwrap()
      .then(() => {
        message.success("Cart updated");
      })
      .catch((error) => {
        message.error(`Failed to update cart: ${error}`);
      });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: ["product", "images"],
      key: "image",
      render: (_, record) => {
        const imageSrc = record.product?.images?.[0] || defaultImage;

        const handleImageError = (e) => {
          e.target.src = defaultImage;
        };

        return (
          <img
            src={imageSrc}
            alt={record.product?.title || "Product Image"}
            onError={handleImageError}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: 5,
            }}
          />
        );
      },
    },
    {
      title: "Item",
      dataIndex: ["product", "title"], // Access product title
      key: "title",
    },
    {
      title: "Price",
      dataIndex: ["product", "price"], // Access product price
      key: "price",
      render: (price) => `₨ ${price || 0}`, // Format price
    },
    {
      title: "Quantity",
      dataIndex: "quantity", // Access quantity
      key: "quantity",
      render: (quantity, record) => (
        <div className="flex items-center">
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleUpdateQuantity(record.product._id, quantity - 1)}
            disabled={quantity <= 1}
            className="border-gray-300"
          />
          <span className="mx-2">{quantity}</span>
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleUpdateQuantity(record.product._id, quantity + 1)}
            className="border-gray-300"
          />
        </div>
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const price = record.product?.price || 0;
        const quantity = record.quantity || 0;
        return `₨ ${(price * quantity)}`;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Remove item"
          description="Are you sure you want to remove this item?"
          onConfirm={() => handleRemoveItem(record.product._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ className: "bg-black text-white" }}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
          />
        </Popconfirm>
      ),
    },
  ];

  // Handle checkout button click
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Handle continue shopping button click
  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (status === "loading") {
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

  if (!cartItems || !cartItems.cartItems || cartItems.cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Your cart is empty"
            />
            <Button
              icon={<ShoppingOutlined />}
              onClick={handleContinueShopping}
              className="mt-4 bg-black text-white hover:bg-gray-800"
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.cartItems.length} {cartItems.cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="p-6">
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              rowKey="key"
              className="mb-6"
            />
          </div>

          <div className="p-6 bg-gray-50">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <Button
                  icon={<ShoppingOutlined />}
                  onClick={handleContinueShopping}
                  className="border-black text-black hover:bg-gray-100"
                >
                  Continue Shopping
                </Button>
              </div>

              <div className="w-full md:w-80">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>₨ {itemsPrice}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>₨ {shippingPrice}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>₨ {taxPrice}</span>
                  </div>

                  <Divider className="my-2" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₨ {totalPrice}</span>
                  </div>

                  <Button
                    type="primary"
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-black text-white hover:bg-gray-800"
                  >
                    Proceed to Checkout
                  </Button>
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

export default CartView;
