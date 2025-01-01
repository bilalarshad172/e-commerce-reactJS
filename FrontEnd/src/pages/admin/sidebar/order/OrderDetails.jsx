import React from "react";
import { MobileOutlined } from "@ant-design/icons";

const OrderDetails = () => {
  return (
    <div className="border rounded-md shadow-md p-5 mt-5">
      <h3 className="text-2xl font-semibold">Order No 12</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="border rounded-md shadow-md mt-5 col-span-2">
          <h6 className="text-xl font-semibold p-2"> Order Details</h6>
          <hr />
          <div className="flex justify-between items-center mx-2 p-2">
            <img
              src="https://via.placeholder.com/150"
              alt="product"
              className="w-20 h-20"
            />
            <div className="flex flex-col">
              <h6 className="text-lg font-semibold">Product Name</h6>
              <p className="text-sm">Product Description</p>
              <p className="text-sm">Price</p>
            </div>
            <p>$21</p>
            <p>2</p>
            <p>$42</p>
          </div>
          <hr />
          <div className="flex flex-col items-end mx-2 p-2 gap-1">
            <p>
              Subtotal: <span className="font-bold">$65.00</span>
            </p>
            <p>
              Shipping fee: <span className="font-bold">$0.00</span>
            </p>
            <p>
              Tax: <span className="font-bold">$7.00</span>
            </p>
            <p>
              Total: <span className="font-bold">$65.00</span>
            </p>
            <p>
              Amount paid: <span className="font-bold">$65.00</span>
            </p>
          </div>
        </div>
        <div className="border rounded-md shadow-md mt-5 col-span-1">
          <h6 className="text-xl font-semibold p-2"> Customer</h6>
          <hr />

          <div className="flex flex-col p-2">
            <p className="text-md font-semibold">Amanda Harvey</p>
            <p className="text-sm">@ Ella@site.com</p>
            <p className="text-sm">
              <MobileOutlined style={{ fontSize: "12px" }} />
              +1 (609) 972-22-22
            </p>
          </div>
          <hr />
          <div className="flex flex-col p-2">
            <p className="text-md font-semibold">Shipping Address</p>
            <p className="text-sm">
              45 Roker Terrace Latheronwheel KW5 8NW, London Uk
            </p>
          </div>
          <hr />
          <div className="flex flex-col p-2">
            <p className="text-md font-semibold">Billing Address</p>
            <p className="text-sm">
              45 Roker Terrace Latheronwheel KW5 8NW, London Uk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
