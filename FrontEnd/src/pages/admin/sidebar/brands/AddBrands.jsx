import React, { useState } from "react";
import { TreeSelect } from "antd";

const treeData = [
  {
    value: "parent 1",
    title: "parent 1",
    children: [
      {
        value: "parent 1-0",
        title: "parent 1-0",
        children: [
          {
            value: "leaf1",
            title: "my leaf",
          },
          {
            value: "leaf2",
            title: "your leaf",
          },
        ],
      },
      {
        value: "parent 1-1",
        title: "parent 1-1",
        children: [
          {
            value: "sss",
            title: (
              <b
                style={{
                  color: "#08c",
                }}
              >
                sss
              </b>
            ),
          },
        ],
      },
    ],
  },
];

const AddBrands = () => {
  const [value, setValue] = useState();
  const onChange = (newValue) => {
    console.log(newValue);
    setValue(newValue);
  };
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="flex items-center justify-between mx-5">
        <h3 className=" mt-2 text-xl font-semibold">Add Brands</h3>
        <button className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white">
          Save
        </button>
      </div>
      <div className="flex flex-col my-3">
        <label className="mx-5 font-semibold">Brand Name</label>
        <input type="text" className="border rounded mx-5 p-1" id="cat_name" />
      </div>
    </div>
  );
};

export default AddBrands;
