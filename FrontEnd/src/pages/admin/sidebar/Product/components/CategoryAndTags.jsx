import React, { useState, useEffect } from "react";
import { TreeSelect, Select, Form, Spin, Alert, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchBrands } from "../../../../../redux/brandsSlice";
import { fetchCategories } from "../../../../../redux/categorySlice";
import { InfoCircleOutlined, TagsOutlined, AppstoreOutlined } from "@ant-design/icons";

const CategoryAndTags = ({ category, setCategory, brand, setBrand }) => {
  const { brands, loading: brandsLoading } = useSelector((state) => state.brands);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);
  const [treeValue, setTreeValue] = useState(category);
  const dispatch = useDispatch();

  // Check if data is loaded and valid
  const isCategoryValid = Array.isArray(category) && category.length > 0;
  const isBrandValid = brand && brand.trim() !== '';

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // If "category" from parent changes for any reason, sync local treeValue
    setTreeValue(category);
  }, [category]);

  const transformCategories = (categories) => {
    if (!Array.isArray(categories)) return [];

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
    setCategory(newValue);
  };

  const onBrandChange = (val) => {
    setBrand(val);
  };

  const isLoading = brandsLoading || categoriesLoading;

  return (
    <div className="categories-and-tags">
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-4">Categories and Brands</h3>

        {isLoading ? (
          <div className="text-center py-6">
            <Spin tip="Loading categories and brands..." />
          </div>
        ) : (
          <Form layout="vertical">
            <Form.Item
              label={
                <span className="font-medium">
                  Product Category <span className="text-red-500">*</span>
                  <Tooltip title="Select at least one category for your product">
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </span>
              }
              required
              validateStatus={isCategoryValid ? "success" : "error"}
              help={!isCategoryValid && "Please select at least one category"}
            >
              <TreeSelect
                showSearch
                value={treeValue}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                }}
                placeholder="Select product categories"
                allowClear
                multiple
                treeDefaultExpandAll
                onChange={onCategoryChange}
                treeData={treeData}
                className="rounded-md"
                notFoundContent={
                  <Alert
                    message="No categories found"
                    description="Please create categories first"
                    type="info"
                    showIcon
                  />
                }
                tagRender={props => (
                  <span className="ant-select-selection-item">
                    <AppstoreOutlined className="mr-1" />
                    {props.label}
                  </span>
                )}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium">
                  Brand <span className="text-red-500">*</span>
                  <Tooltip title="Select the brand for your product">
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </span>
              }
              required
              validateStatus={isBrandValid ? "success" : "error"}
              help={!isBrandValid && "Please select a brand"}
            >
              <Select
                showSearch
                placeholder="Select a brand"
                optionFilterProp="label"
                value={brand}
                onChange={onBrandChange}
                options={brands.map((brand) => ({
                  value: brand._id,
                  label: brand.title,
                }))}
                className="rounded-md"
                notFoundContent={
                  <Alert
                    message="No brands found"
                    description="Please create brands first"
                    type="info"
                    showIcon
                  />
                }
                suffixIcon={<TagsOutlined />}
              />
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CategoryAndTags;
