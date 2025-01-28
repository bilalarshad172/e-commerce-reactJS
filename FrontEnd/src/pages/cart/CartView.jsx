import React from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";

const CartView = () => {
  const data = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];
  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Quantity",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Total",
      dataIndex: "address",
      key: "address",
    },
  ];
  return (
    <div className="container mx-auto px-4">
      <div className="border container mx-auto px-4 rounded-md shadow-md mt-5 text-center">
        <h3 className="text-2xl font-semibold mt-5">Your Cart items</h3>

        <div>
          <Table dataSource={data} columns={columns} pagination={false} />
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
