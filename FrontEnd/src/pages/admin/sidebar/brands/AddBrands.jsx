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
      <h2 className="text-xl font-semibold">
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
        <Button
          style={{
            border: "1px solid black",
            borderRadius: "0.375rem", // Tailwind's rounded-md equivalent
            padding: "0.25rem 0.5rem", // Tailwind's px-2 py-1 equivalent
            marginTop: "0.75rem", // Tailwind's mt-3 equivalent
            color: "black",
            backgroundColor: "white",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s", // Smooth hover effect
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
          }}
          type="default"
          htmlType="submit"
          loading={loading || fetchLoading}
        >
          {id ? "Update Brand" : "Add Brand"}
        </Button>
        <Button
            style={{
            border: "1px solid black",
            borderRadius: "0.375rem", // Tailwind's rounded-md equivalent
            padding: "0.25rem 0.5rem", // Tailwind's px-2 py-1 equivalent
            marginTop: "0.75rem", // Tailwind's mt-3 equivalent
            color: "black",
            backgroundColor: "white",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s", // Smooth hover effect
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
          }}
          type="default"
          className="ml-2"
          onClick={() => navigate("/admin/brands")}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default AddBrands;
