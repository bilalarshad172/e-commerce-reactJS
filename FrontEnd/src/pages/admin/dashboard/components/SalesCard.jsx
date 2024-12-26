import React from "react";
import { DollarOutlined } from "@ant-design/icons";

const SalesCard = () => {
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="grid grid-cols-2 gap-2 p-5">
        <div className="col-span-1 text-center bg-black text-white text-3xl py-2 rounded-md">
          <DollarOutlined style={{ fontSize: "48px"  }} />
        </div>
        <div className="col-span-1 flex flex-col justify-center">
          <h4 className="text-lg font-semibold">Total Sales</h4>
          <p className="text-xl text-gray-600">$5000</p>
        </div>
      </div>
    </div>
  );
};

export default SalesCard;
