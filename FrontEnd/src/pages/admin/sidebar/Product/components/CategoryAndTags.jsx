import React, { useState, useEffect } from "react";
import { TreeSelect, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchBrands } from "../../../../../redux/brandsSlice";
import { fetchCategories } from "../../../../../redux/categorySlice";

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
  const { brands } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  console.log(categories);
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);
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
            treeData={
              categories
              // Assuming `id` is the unique key for each category
            }
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
        <div className="flex flex-col">
          <label className="mx-5 font-semibold">Brands</label>
          <Select
            style={{
              marginRight: "1.25rem",
              marginLeft: "1.25rem",
            }}
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            options={brands.map((brand) => ({
              value: brand._id,
              label: brand.title,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryAndTags;
