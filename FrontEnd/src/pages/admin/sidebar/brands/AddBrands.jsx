import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBrand,
  fetchBrandById,
  updateBrand,
} from "../../../../redux/brandsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, message, Spin, Typography, Card, Alert } from "antd";
import { NavLink } from "react-router-dom";
import {
  SaveOutlined,
  CloseOutlined,
  TagOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <NavLink
              to="/admin/brands"
              className="mr-4 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeftOutlined style={{ fontSize: '16px' }} />
            </NavLink>
            <div>
              <Title level={3} className="m-0">
                {id ? "Edit Brand" : "Add New Brand"}
              </Title>
              <Text type="secondary">
                {id
                  ? "Update existing brand details"
                  : "Create a new brand for your products"}
              </Text>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-sm mb-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                title: "", // Default value for the form
              }}
              className="max-w-2xl"
            >
              <div className="mb-4">
                <TagOutlined className="text-gray-400 mr-2" />
                <Text strong>Brand Information</Text>
              </div>

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
                  className="rounded-md"
                  size="large"
                  defaultValue={id && brand ? brand.title : ""}
                />
              </Form.Item>

              <Alert
                message="Brand Usage Information"
                description="Brands can be assigned to products to help customers filter and find products from their favorite manufacturers."
                type="info"
                showIcon
                className="mb-6"
              />

              <div className="flex gap-3 mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading || fetchLoading}
                  className="bg-black hover:bg-gray-800 border-black"
                  size="large"
                >
                  {id ? "Update Brand" : "Create Brand"}
                </Button>
                <NavLink to="/admin/brands">
                  <Button
                    icon={<CloseOutlined />}
                    size="large"
                  >
                    Cancel
                  </Button>
                </NavLink>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddBrands;
