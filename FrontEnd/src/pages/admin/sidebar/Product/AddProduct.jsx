import React, { useState, useEffect } from "react";
import ProductDetails from "./components/ProductDetails";
import ProductImages from "./components/ProductImages";
import CategoryAndTags from "./components/CategoryAndTags";
import PricingAndInventory from "./components/PricingAndInventory";
import {
  createProduct,
  resetCreateStatus,
  updateProduct,
  fetchProductById
} from "../../../../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  message,
  Button,
  Typography,
  Steps,
  Spin
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  ShoppingOutlined,
  TagsOutlined,
  DollarOutlined,
  PictureOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const AddProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [countInStock, setCountInStock] = useState();
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const { loading, productForEdit, error, createSuccess } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (createSuccess) {
      message.success("Product created!");
      dispatch(resetCreateStatus());
      navigate("/admin/products/table");
    } else if (error) {
      message.error(`Failed: ${error}`);
      dispatch(resetCreateStatus());
    }
  }, [createSuccess, error, dispatch]);

   useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    } else {
      // If no id, clear out any leftover product from state
      // (not strictly necessary if your slice does it on mount)
    }
   }, [id, dispatch]);

  useEffect(() => {
    if (id && productForEdit) {
      setTitle(productForEdit.title || "");
      setDescription(productForEdit.description || "");
      setPrice(productForEdit.price || "");
      setCountInStock(productForEdit.countInStock || "");
      setCategory(productForEdit.category.map(cat => cat._id));
      setBrand(productForEdit.brand._id || "");
      // If your product has images array, set those
      setUploadedImages(productForEdit.images || []);
    }
  }, [id, productForEdit]);

  const handleSave = () => {
    // Validate all required fields before saving
    if (!title || title.trim() === '') {
      message.error("Product name is required");
      setCurrentStep(0); // Go to the first step
      return;
    }

    if (!description || description.trim() === '') {
      message.error("Product description is required");
      setCurrentStep(0); // Go to the first step
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      message.error("Valid price is required");
      setCurrentStep(1); // Go to the pricing step
      return;
    }

    if (countInStock === undefined || isNaN(Number(countInStock))) {
      message.error("Valid inventory count is required");
      setCurrentStep(1); // Go to the pricing step
      return;
    }

    if (!category || (Array.isArray(category) && category.length === 0)) {
      message.error("At least one category is required");
      setCurrentStep(2); // Go to the categories step
      return;
    }

    if (!brand || brand.trim() === '') {
      message.error("Brand is required");
      setCurrentStep(2); // Go to the categories step
      return;
    }

    if (!uploadedImages || uploadedImages.length === 0) {
      message.error("At least one product image is required");
      setCurrentStep(3); // Go to the images step
      return;
    }

    // Build the payload
    const productData = {
      title,
      description,
      price,
      countInStock,
      category,
      brand,
      images: uploadedImages,
    };

    // If editing, dispatch updateProduct
    if (id) {
      dispatch(updateProduct({ id, ...productData }))
        .unwrap() // if you're using RTK, unwrap helps with error handling
        .then(() => {
          message.success("Product updated successfully");
          // Use setTimeout to ensure the navigation happens after the state updates
          setTimeout(() => {
            navigate("/admin/products/table", { replace: true });
          }, 500);
        })
        .catch((err) => {
          message.error("Update error: " + (err.message || "Unknown error"));
          console.error("Update error:", err);
        });
    } else {
      // If adding, dispatch createProduct
      dispatch(createProduct(productData))
        .unwrap()
        .then(() => {
          message.success("Product created successfully");
          // Use setTimeout to ensure the navigation happens after the state updates
          setTimeout(() => {
            navigate("/admin/products/table", { replace: true });
          }, 500);
        })
        .catch((err) => {
          message.error("Create error: " + (err.message || "Unknown error"));
          console.error("Create error:", err);
        });
    }
  };

  // Current step in the product creation/editing process
  const [currentStep, setCurrentStep] = useState(0);

  // Steps for the product creation/editing process
  const steps = [
    {
      title: 'Basic Info',
      icon: <ShoppingOutlined />,
      content: (
        <ProductDetails
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />
      )
    },
    {
      title: 'Pricing',
      icon: <DollarOutlined />,
      content: (
        <PricingAndInventory
          price={price}
          setPrice={setPrice}
          countInStock={countInStock}
          setCountInStock={setCountInStock}
        />
      )
    },
    {
      title: 'Categories',
      icon: <TagsOutlined />,
      content: (
        <CategoryAndTags
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
        />
      )
    },
    {
      title: 'Images',
      icon: <PictureOutlined />,
      content: (
        <ProductImages
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      )
    }
  ];

  // Function to validate current step before proceeding
  const validateStep = () => {
    switch (currentStep) {
      case 0: // Basic Info
        if (title.trim() === '') {
          message.warning('Please enter a product title');
          return false;
        }
        if (description.trim() === '') {
          message.warning('Please enter a product description');
          return false;
        }
        return true;

      case 1: // Pricing
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
          message.warning('Please enter a valid price');
          return false;
        }
        if (countInStock === undefined || isNaN(Number(countInStock))) {
          message.warning('Please enter a valid inventory count');
          return false;
        }
        return true;

      case 2: // Categories
        if (!category) {
          message.warning('Please select at least one category');
          return false;
        }
        if (!brand) {
          message.warning('Please select a brand');
          return false;
        }
        return true;

      case 3: // Images
        // Images are required
        if (!uploadedImages || uploadedImages.length === 0) {
          message.warning('At least one product image is required');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Function to handle next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      message.warning('Please fill in all required fields before proceeding.');
    }
  };

  // Function to handle previous step
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-white p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Title level={3} className="m-0">{id ? "Edit Product" : "Add New Product"}</Title>
              <Text type="secondary">
                {id
                  ? "Update existing product details here"
                  : "Add product information like name, price, description, etc."}
              </Text>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <NavLink
                to="/admin/products/table"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300"
              >
                <ArrowLeftOutlined className="mr-2" />
                Back to Products
              </NavLink>
              <Button
                type="primary"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                icon={<SaveOutlined />}
                loading={loading}
              >
                {id ? "Update Product" : "Save Product"}
              </Button>
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="mb-8">
            <Steps
              current={currentStep}
              onChange={setCurrentStep}
              items={steps.map((step, index) => ({
                title: step.title,
                icon: step.icon,
                status: currentStep === index ? 'process' :
                       currentStep > index ? 'finish' : 'wait'
              }))}
            />
          </div>

          {/* Content Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
            <Spin spinning={loading}>
              {steps[currentStep].content}
            </Spin>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="inline-flex items-center"
            >
              <ArrowLeftOutlined className="mr-2" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                onClick={handleNext}
                className="bg-black hover:bg-gray-800"
              >
                Next
                <ArrowLeftOutlined className="ml-2 transform rotate-180" />
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleSave}
                className="bg-black hover:bg-gray-800"
                icon={<SaveOutlined />}
                loading={loading}
              >
                {id ? "Update Product" : "Save Product"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
