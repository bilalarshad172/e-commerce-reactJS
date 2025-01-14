import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBrand,
  fetchBrandById,
  updateBrand,
} from "../../../../redux/brandsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, message, Spin } from "antd";

const AddBrands = () => {
  const { id } = useParams(); // Get brand ID from the route
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form] = Form.useForm(); // Ant Design form instance
  const [loading, setLoading] = useState(false);

  const { brand, loading: fetchLoading } = useSelector((state) => state.brands);

  // Fetch brand details if editing
  useEffect(() => {
    if (id) {
      dispatch(fetchBrandById(id));
    }
  }, [id, dispatch]);

  // Populate form when brand details are fetched
  useEffect(() => {
    if (id && brand) {
      form.setFieldsValue({
        title: brand.title, // Assuming `title` is the field in the brand object
      });
    }
  }, [brand, id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      if (id) {
        // Edit mode
        await dispatch(updateBrand({ id, ...values })).unwrap();
        message.success("Brand updated successfully!");
      } else {
        // Add mode
        await dispatch(addBrand(values)).unwrap();
        message.success("Brand added successfully!");
      }
      navigate("/admin/brands");
    } catch (error) {
      message.error("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (id && fetchLoading) {
    // Show a loading spinner while fetching brand details
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="border rounded-md shadow-md mt-5 p-5">
      <h2 className="text-xl font-semibold mb-3">
        {id ? "Edit Brand" : "Add Brand"}
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: "", // Default value for the form
        }}
      >
        <Form.Item
          label="Brand Name"
          name="title"
          rules={[
            { required: true, message: "Please enter the brand name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input
            placeholder="Enter brand name"
            defaultValue={id && brand ? brand.title : ""}
          />
        </Form.Item>
        <button
          className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white"
        
          type="default"
          htmlType="submit"
          loading={loading || fetchLoading}
        >
          {id ? "Update Brand" : "Add Brand"}
        </button>
        <button
           className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white ml-2"
          type="default"
          onClick={() => navigate("/admin/brands")}
        >
          Cancel
        </button>
      </Form>
    </div>
  );
};

export default AddBrands;
