import React,{useState} from "react";
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

const CategoryAndTags = () => {
    
    const [value, setValue] = useState();
  const onChange = (newValue) => {
    console.log(newValue);
    setValue(newValue);
  };
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">Categories</h3>
        <div className="flex flex-col mt-3">
          <label className="mx-5 font-semibold">Product Category</label>
          <TreeSelect
            showSearch
            style={{
                marginRight: "1.25rem",
                marginLeft: "1.25rem",
            }}
            value={value}
            dropdownStyle={{
              maxHeight: 400,
              overflow: "auto",
            }}
            placeholder="Please select"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
          />
        </div>
        <div className="flex flex-col">
          <label className="mx-5 font-semibold">Product Tags</label>
          <TreeSelect
            showSearch
            style={{
                marginRight: "1.25rem",
                marginLeft: "1.25rem",
            }}
            value={value}
            dropdownStyle={{
              maxHeight: 400,
              overflow: "auto",
            }}
            placeholder="Please select"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryAndTags;
