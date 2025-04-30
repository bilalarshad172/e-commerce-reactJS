import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Check if user is already logged in and is an admin
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    try {
      const resultAction = await dispatch(getUser(values));

      if (getUser.fulfilled.match(resultAction)) {
        // Check if the user is an admin
        if (resultAction.payload.role === "admin") {
          message.success("Admin login successful!");
          navigate("/admin/dashboard");
        } else {
          message.error("Access denied. Admin privileges required.");
        }
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2}>Admin Login</Title>
          <Text type="secondary">Enter your credentials to access the admin dashboard</Text>
        </div>

        <Form
          form={form}
          name="admin_login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input placeholder="admin@example.com" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-black text-white hover:bg-gray-800"
              size="large"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>

        {error && (
          <div className="mt-4 text-center">
            <Text type="danger">{error}</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminLogin;