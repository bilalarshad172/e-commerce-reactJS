import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TreeSelect, message, Button, Form, Input, Spin, Typography, Card, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  fetchCategoryById,
} from "../../../../redux/categorySlice";
import { NavLink } from "react-router-dom";
import {
  SaveOutlined,
  CloseOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <NavLink
              to="/admin/categories"
              className="mr-4 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeftOutlined style={{ fontSize: '16px' }} />
            </NavLink>
            <div>
              <Title level={3} className="m-0">
                {id ? "Edit Category" : "Add New Category"}
              </Title>
              <Text type="secondary">
                {id
                  ? "Update existing category details"
                  : "Create a new category for your products"}
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
                title: "",
                parent: null,
              }}
              className="max-w-2xl"
            >
              <div className="mb-4">
                <AppstoreOutlined className="text-gray-400 mr-2" />
                <Text strong>Category Information</Text>
              </div>

              <Form.Item
                label="Category Name"
                name="title"
                rules={[
                  { required: true, message: "Please enter the category name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input
                  placeholder="Enter category name"
                  className="rounded-md"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Parent Category (Optional)"
                name="parent"
                extra="Leave empty to create a top-level category"
              >
                <TreeSelect
                  showSearch
                  placeholder="Select parent category"
                  allowClear
                  treeDefaultExpandAll
                  treeData={treeData}
                  className="rounded-md"
                  size="large"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Form.Item>

              <Alert
                message="Category Structure Information"
                description="Categories can be nested to create a hierarchy. A category without a parent will be a top-level category."
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
                  {id ? "Update Category" : "Create Category"}
                </Button>
                <NavLink to="/admin/categories">
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

export default AddCategories;
