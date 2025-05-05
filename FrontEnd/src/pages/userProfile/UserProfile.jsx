import React, { useEffect, useState, useRef } from "react";
import { Avatar, message, Typography, Card, Button, Form, Input, Divider, Spin, Tabs, Tag } from "antd";
import {
  UserOutlined,
  MailOutlined,
  CameraOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  ShoppingOutlined
} from "@ant-design/icons";
import { getUserProfile, updateUserProfile } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import PhoneInputField from "../../components/PhoneInput";
import { useNavigate, NavLink } from "react-router-dom";
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [form] = Form.useForm();
  const { user, loading } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || {},
    photoURL: user?.photoURL || "",
  });
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  useEffect(() => {
    dispatch(getUserProfile())
      .unwrap()
      .catch((err) => {
        if (err === "Unauthorized") {
          navigate("/login");
        }
      });
  }, [dispatch, navigate]);

  // Update form and profileData when user data changes
  useEffect(() => {
    if (user) {
      // Log the user data to see what's coming from the server
      console.log("User data from server:", user);

      // Ensure phone data is properly structured
      const phoneData = user.phone && (user.phone.fullPhoneNumber || user.phone.isoCode)
        ? user.phone
        : { fullPhoneNumber: "", isoCode: "" };

      setProfileData({
        username: user.username || "",
        email: user.email || "",
        phone: phoneData,
        photoURL: user.photoURL || "",
      });

      form.setFieldsValue({
        username: user.username || "",
        email: user.email || "",
        phone: phoneData,
      });

      // Log the phone data being set
      console.log("Phone data being set:", phoneData);
    }
  }, [user, form]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // get the first file
    if (!file) return;

    // Create form data for the single file
    const formData = new FormData();
    formData.append("files", file);

    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Parse the JSON
      const data = await response.json();
      const { urls } = data;

      if (urls && urls.length > 0) {
        // Update the local state to reflect the new image URL
        setProfileData((prev) => ({
          ...prev,
          photoURL: urls[0],
        }));
        message.success("Profile image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = (values) => {
    // Make sure phone data is properly structured with required fields
    const phoneData = values.phone || {};

    // Ensure phone object has the correct structure
    const formattedPhoneData = {
      fullPhoneNumber: phoneData.fullPhoneNumber || "",
      isoCode: phoneData.isoCode || ""
    };

    // Only include phone data if it's actually filled in
    const hasPhoneData = formattedPhoneData.fullPhoneNumber && formattedPhoneData.isoCode;

    const updatedData = {
      ...values,
      photoURL: profileData.photoURL,
      phone: hasPhoneData ? formattedPhoneData : null
    };

    console.log("Updated profile data being sent =>", updatedData);

    try {
      dispatch(
        updateUserProfile({ userId: user._id, updatedData: updatedData })
      )
        .unwrap()
        .then((response) => {
          console.log("Profile update response:", response);
          message.success("Profile updated successfully");
          // Refresh user data
          dispatch(getUserProfile());
        })
        .catch((err) => {
          console.error("Profile update error:", err);
          message.error("Failed to update profile. Please try again.");
        });
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="border rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-white">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/products")}
              className="mr-4 border-black text-black hover:bg-gray-100"
            >
              Back
            </Button>
            <div>
              <Title level={3} className="m-0">User Profile</Title>
              <Text type="secondary">Manage your account information</Text>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image Section */}
              <div className="md:col-span-1">
                <Card className="text-center shadow-sm">
                  <div className="flex flex-col items-center">
                    {profileData.photoURL ? (
                      <img
                        src={profileData.photoURL}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 mb-4"
                        onError={() => console.log("Image failed to load")}
                      />
                    ) : (
                      <Avatar
                        style={{
                          backgroundColor: "#87d068",
                        }}
                        size={128}
                        icon={<UserOutlined />}
                        className="mb-4"
                      />
                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <Button
                      onClick={() => fileRef.current.click()}
                      icon={<CameraOutlined />}
                      loading={uploading}
                      className="border-black text-black hover:bg-gray-100"
                    >
                      {uploading ? "Uploading..." : "Change Photo"}
                    </Button>

                    <Divider />

                    <div className="text-left w-full">
                      <div className="mb-2">
                        <Text strong>Account Type:</Text>
                        <div>
                          <Tag color={user?.role === "admin" ? "blue" : "green"} className="mt-1">
                            {user?.role === "admin" ? "Administrator" : "Customer"}
                          </Tag>
                        </div>
                      </div>

                      <div className="mb-2">
                        <Text strong>Member Since:</Text>
                        <div className="text-gray-500">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "Not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Profile Form Section */}
              <div className="md:col-span-2">
                <Card className="shadow-sm">
                  <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Profile Information" key="1">
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        initialValues={{
                          username: user?.username || "",
                          email: user?.email || "",
                          phone: user?.phone || {},
                        }}
                      >
                        <Form.Item
                          label={<span className="font-medium">Full Name</span>}
                          name="username"
                          rules={[
                            { required: true, message: "Please enter your name" },
                            { min: 2, message: "Name must be at least 2 characters" },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Enter your full name"
                            size="large"
                          />
                        </Form.Item>

                        <Form.Item
                          label={<span className="font-medium">Email Address</span>}
                          name="email"
                          rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Please enter a valid email" },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="Enter your email address"
                            size="large"
                          />
                        </Form.Item>

                        <Form.Item
                          label={<span className="font-medium">Phone Number</span>}
                          name="phone"
                          help="Enter your phone number with country code"
                        >
                          <PhoneInputField
                            phoneData={form.getFieldValue('phone')}
                            setPhoneData={(phoneObj) => {
                              // Log the phone object to see what's being set
                              console.log("Phone object from input:", phoneObj);

                              // Ensure the phone object has the correct structure
                              const formattedPhone = {
                                fullPhoneNumber: phoneObj.fullPhoneNumber || "",
                                isoCode: phoneObj.isoCode || ""
                              };

                              // Update the form with the formatted phone data
                              form.setFieldsValue({ phone: formattedPhone });
                            }}
                          />
                        </Form.Item>

                        <Form.Item className="mt-6">
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            size="large"
                            className="bg-black hover:bg-gray-800 border-black"
                          >
                            Save Changes
                          </Button>
                        </Form.Item>
                      </Form>
                    </TabPane>

                    <TabPane tab="My Orders" key="2">
                      <div className="py-4">
                        <NavLink to="/user/orders" className="text-blue-600 hover:underline flex items-center">
                          <ShoppingOutlined className="mr-2" /> View all your orders
                        </NavLink>
                      </div>
                    </TabPane>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
