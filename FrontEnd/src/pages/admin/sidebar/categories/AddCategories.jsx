import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TreeSelect, message, Button, Form, Input, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  fetchCategoryById,
} from "../../../../redux/categorySlice";
import { NavLink } from "react-router-dom";

const AddCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Local state for the form
  const [form] = Form.useForm(); // Ant Design form instance
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);

  const {
    selectedCategory,
    loading: fetchLoading,
    categories,
  } = useSelector((state) => state.categories);

  // Fetch all categories for the dropdown
  useEffect(() => {
    dispatch(fetchCategories());
    if (id) {
      dispatch(fetchCategoryById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && selectedCategory) {
      form.setFieldsValue({
        title: selectedCategory.title,
        parent: selectedCategory.parent || null,
      });
    }
  }, [selectedCategory, id, form]);

  useEffect(() => {
    const transformCategories = (categories) => {
      return categories.map((cat) => ({
        title: cat.title,
        value: cat._id,
        children: cat.children ? transformCategories(cat.children) : null,
      }));
    };

    if (categories) {
      setTreeData(transformCategories(categories));
    }
  }, [categories]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (id) {
        // Edit mode
        await dispatch(updateCategory({ id, ...values })).unwrap();
        message.success("Category updated successfully!");
      } else {
        // Add mode
        await dispatch(addCategory(values)).unwrap();
        message.success("Category added successfully!");
      }
      navigate("/admin/categories");
    } catch (error) {
      message.error("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (id && fetchLoading) {
    // Show a loading spinner while fetching category details
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="border rounded-md shadow-md mt-5 p-5">
      <h2 className="text-xl font-semibold mb-3">
        {id ? "Edit Category" : "Add Category"}
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: "",
          parent: null,
        }}
      >
        <Form.Item
          label="Category Name"
          name="title"
          rules={[
            { required: true, message: "Please enter the category name" },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item label="Parent Category" name="parent">
          <TreeSelect
            showSearch
            placeholder="Select parent category"
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
          />
        </Form.Item>
        <div className="flex gap-2 items-center my-3">
           <button
            className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white"
            type="submit"
            loading={loading || fetchLoading}
          >
            {id ? "Update Category" : "Add Category"}
          </button>
          <NavLink
            to={"/admin/categories"}
            className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white"
          >
            Cancel
          </NavLink>
         
        </div>
      </Form>
    </div>
  );
};

export default AddCategories;
