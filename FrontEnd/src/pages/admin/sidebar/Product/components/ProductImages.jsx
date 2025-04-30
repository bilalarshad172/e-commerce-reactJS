import React, { useState, useRef, useEffect } from "react";
import { Carousel, Upload, Button, message, Empty, Card, Image, Spin, Tooltip, Form, Alert } from "antd";
import { PictureOutlined, UploadOutlined, DeleteOutlined, EyeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import defaultImage from "../../../../../assets/default.png";

const ProductImages = ({ uploadedImages, setUploadedImages }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Check if at least one image is uploaded
  const hasImages = Array.isArray(uploadedImages) && uploadedImages.length > 0;

  // Debug: Log uploaded images whenever they change
  useEffect(() => {
    console.log("Current uploadedImages:", uploadedImages);
  }, [uploadedImages]);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    message.loading({ content: 'Uploading...', key: 'uploading' });

    // Use "files" as the field name since your backend uses upload.array('files', 5)
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        // Do NOT set Content-Type. Let the browser set the correct boundary for FormData
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Parse JSON response
      const data = await response.json();
      const { urls } = data;

      console.log("Uploaded URLs:", urls);

      // Update your React state
      setUploadedImages((prevUrls) => [...prevUrls, ...urls]);
      message.success({ content: 'Upload successful!', key: 'uploading' });

      // Clear the file input
      if (fileRef.current) {
        fileRef.current.value = null;
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      message.error({ content: 'Upload failed: ' + error.message, key: 'uploading' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    message.success('Image removed');
  };

  const handlePreview = (image) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  return (
    <div className="product-images-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Product Images <span className="text-red-500">*</span>
          <Tooltip title="At least one product image is required">
            <InfoCircleOutlined className="ml-1 text-gray-400" />
          </Tooltip>
        </h3>

        <Form layout="vertical">
          <Form.Item
            validateStatus={hasImages ? "success" : "error"}
            help={!hasImages && "At least one product image is required"}
            className="mb-4"
          >
            {hasImages ? (
              <Alert
                message={`${uploadedImages.length} ${uploadedImages.length === 1 ? 'image' : 'images'} uploaded`}
                type="success"
                showIcon
                className="mb-4"
              />
            ) : (
              <Alert
                message="No images uploaded"
                description="Please upload at least one product image"
                type="error"
                showIcon
                className="mb-4"
              />
            )}
          </Form.Item>
        </Form>

        {/* Image Preview Section */}
        {uploadedImages && uploadedImages.length > 0 ? (
          <div className="mb-6">
            <Carousel autoplay className="mb-4 border rounded-lg overflow-hidden">
              {uploadedImages.map((imgUrl, index) => (
                <div key={index} className="h-64 flex items-center justify-center bg-gray-50">
                  <img
                    src={imgUrl}
                    alt={`Product ${index + 1}`}
                    onError={(e) => { e.target.src = defaultImage; }}
                    className="max-h-64 max-w-full object-contain"
                  />
                </div>
              ))}
            </Carousel>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {uploadedImages.map((imgUrl, index) => (
                <Card
                  key={index}
                  hoverable
                  className="relative overflow-hidden"
                  cover={
                    <div className="h-20 flex items-center justify-center bg-gray-50">
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${index + 1}`}
                        onError={(e) => { e.target.src = defaultImage; }}
                        className="max-h-20 max-w-full object-contain"
                      />
                    </div>
                  }
                  actions={[
                    <Tooltip title="Preview">
                      <EyeOutlined key="preview" onClick={() => handlePreview(imgUrl)} />
                    </Tooltip>,
                    <Tooltip title="Delete">
                      <DeleteOutlined key="delete" onClick={() => handleRemoveImage(index)} />
                    </Tooltip>
                  ]}
                />
              ))}
            </div>
          </div>
        ) : (
          <Empty
            image={<PictureOutlined style={{ fontSize: 60 }} />}
            description="No images uploaded yet"
            className="my-8 bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300"
          />
        )}

        {/* Upload Section */}
        <div className="mt-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="dashed"
            icon={<UploadOutlined />}
            onClick={() => fileRef.current.click()}
            loading={uploading}
            className="w-full h-16 flex items-center justify-center"
            status={!hasImages ? "error" : undefined}
          >
            {uploading ? 'Uploading...' : 'Click to Upload Images'}
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Supported formats: JPG, PNG, JPEG. Max 5 images.
          </p>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setPreviewVisible(false)}>
          <div className="max-w-4xl max-h-screen p-4" onClick={e => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain"
              onError={(e) => { e.target.src = defaultImage; }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
