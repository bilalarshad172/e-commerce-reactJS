import React, { useState, useEffect } from "react";
import { TreeSelect, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchBrands } from "../../../../../redux/brandsSlice";
import { fetchCategories } from "../../../../../redux/categorySlice";

const CategoryAndTags = ({ category, setCategory, brand, setBrand }) => {
  const { brands } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.categories);
  const [treeValue, setTreeValue] = useState(category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // If "category" from parent changes for any reason, sync local treeValue
    setTreeValue(category);
  }, [category]);

  const transformCategories = (categories) => {
    return categories.map((category) => ({
      title: category.title, // Display text
      value: category._id, // Unique value
      children: category.children
        ? transformCategories(category.children)
        : null, // Recursively map children
    }));
  };

  const treeData = transformCategories(categories);

  const onCategoryChange = (newValue) => {
    setTreeValue(newValue);
    // If you allow multiple categories, you might store an array
    // but let's assume single category for simplicity:
    setCategory(newValue);
  };

  const onBrandChange = (val) => {
    setBrand(val);
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
            value={treeValue}
            dropdownStyle={{
              maxHeight: 400,
              overflow: "auto",
            }}
            placeholder="Please select"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={onCategoryChange}
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
            value={brand}
            onChange={onBrandChange}
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
