import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../redux/cartSlice";
import defaultImage from "../../assets/default.png";

const CartView = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const dataSource = (cartItems?.cartItems || []).map((item, index) => ({
    key: index.toString(),
    ...item, // Spread item to include product and quantity
  }));
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
      render: (price) => `₨ ${price}`, // Format price
    },
    {
      title: "Quantity",
      dataIndex: "quantity", // Access quantity
      key: "quantity",
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) =>
        `₨ ${(record.product.price * record.quantity)}`, // Calculate total
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="border container mx-auto px-4 rounded-md shadow-md mt-5 text-center">
        <h3 className="text-2xl font-semibold mt-5">Your Cart items</h3>

        <div>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>
        <div className="flex justify-end my-5">
          <div className="w-1/4">
            <div className="flex  justify-between items-center mt-5 mx-2">
              <h4 className="font-semibold">Subtotal</h4>
              <p className="font-light">$100</p>
            </div>
            <hr />
            <div className="flex  justify-between items-center mt-5 mx-2">
              <h4 className="font-semibold">Subtotal</h4>
              <p className="font-light">$100</p>
            </div>
            <hr />
            <div className="flex  justify-between items-center mt-5 mx-2">
              <h4 className="font-semibold">Subtotal</h4>
              <p className="font-light">$100</p>
            </div>
            <button className="border rounded-md w-full py-1 mt-5 border-black text-black hover:bg-black hover:text-white">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
