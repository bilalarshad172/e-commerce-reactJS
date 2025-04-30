import React from "react";
import { Form, Input } from "antd";

const { TextArea } = Input;

const ProductDetails = ({ title, setTitle, description, setDescription }) => {
  return (
    <div className="product-details">
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-4">General Information</h3>

        <Form layout="vertical">
          <Form.Item
            label={
              <span className="font-medium">
                Product Name <span className="text-red-500">*</span>
              </span>
            }
            required
            validateStatus={title ? "success" : "error"}
            help={!title && "Product name is required"}
          >
            <Input
              placeholder="Enter product name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="pro_name"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium">
                Product Description <span className="text-red-500">*</span>
              </span>
            }
            required
            validateStatus={description ? "success" : "error"}
            help={!description && "Product description is required"}
          >
            <TextArea
              placeholder="Enter detailed product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              id="pro_desc"
              className="rounded-md"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ProductDetails;
