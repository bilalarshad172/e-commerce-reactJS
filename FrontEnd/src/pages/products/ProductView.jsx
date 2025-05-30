import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { fetchProductById, resetCreateStatus, fetchProducts } from "../../redux/productSlice";
import DefaultImage from "../../assets/default.png";
import { Spin, Tag, Rate, InputNumber, Button, Tabs, message, Breadcrumb } from "antd";
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import Card from "../../components/Card";
import { AddtoCart } from "../../redux/cartSlice";

const { TabPane } = Tabs;

const ProductView = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productForEdit, loadingSingleProduct, error, products } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch product by ID
    dispatch(fetchProductById(id));

    // Also fetch all products for related products section
    dispatch(fetchProducts());

    // Cleanup: Clear selected product when component unmounts
    return () => {
      dispatch(resetCreateStatus());
    };
  }, [dispatch, id]);

  // Get product images or use default
  const productImages = productForEdit?.images?.length
    ? productForEdit.images
    : [DefaultImage];

  const handleImageError = (e) => {
    e.target.src = DefaultImage;
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  // Handle quantity change
  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!user) {
      // If user is not logged in, show a warning or redirect
      message.warning("Please log in or sign up to add to cart");
      return;
    }

    if (quantity <= 0) {
      message.error("Quantity must be at least 1");
      return;
    }

    // Check if product is in stock
    if (productForEdit.countInStock <= 0) {
      message.error(`${productForEdit.title} is out of stock`);
      return;
    }

    // Check if requested quantity is available
    if (quantity > productForEdit.countInStock) {
      message.error(`Only ${productForEdit.countInStock} units available in stock`);
      return;
    }

    // Construct the cart data
    const cartData = {
      user: user._id,
      cartItems: [
        {
          product: productForEdit._id,
          quantity
        }
      ]
    };

    // Dispatch your Redux thunk to call the backend
    dispatch(AddtoCart(cartData))
      .unwrap()
      .then(() => {
        message.success(`${productForEdit.title} added to cart successfully!`);
      })
      .catch((err) => {
        // Check if the error is due to inventory issues
        if (err.response && err.response.data && err.response.data.error === "Not enough inventory available") {
          const { availableQuantity, productTitle } = err.response.data;
          message.error(`Only ${availableQuantity} units of ${productTitle} available`);
        } else {
          message.error(`Error adding product to cart: ${err}`);
        }
      });
  };

  // Get related products based on category
  const getRelatedProducts = () => {
    if (!productForEdit || !products) return [];

    // Get current product categories
    const currentCategories = productForEdit.category?.map(cat => cat._id) || [];

    // Filter products that share at least one category with current product
    return products
      .filter(product =>
        product._id !== productForEdit._id && // Exclude current product
        product.category?.some(cat =>
          currentCategories.includes(cat._id)
        )
      )
      .slice(0, 4); // Limit to 4 related products
  };


  if (loadingSingleProduct)
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Spin size="large" />
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Error Loading Product</h2>
            <p className="text-red-500 mb-6">{error}</p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 h-auto"
            >
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );

  if (!productForEdit)
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
            <Button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 h-auto"
            >
              Browse Products
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/products">Home</Link>
          </Breadcrumb.Item>
          {productForEdit.category && productForEdit.category.length > 0 && (
            <Breadcrumb.Item>
              <Link to={`/products?category=${productForEdit.category[0]._id}`}>
                {productForEdit.category[0].title}
              </Link>
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>{productForEdit.title}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Product Details Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Gallery */}
            <div className="product-gallery">
              {/* Thumbnails */}
              <div className="product-gallery__thumbnails">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`product-gallery__thumbnail ${index === activeImage ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image}
                      alt={`${productForEdit.title} - Thumbnail ${index + 1}`}
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="product-gallery__main">
                <img
                  src={productImages[activeImage]}
                  alt={productForEdit.title}
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1 className="product-info__title">{productForEdit.title}</h1>

              <div className="flex items-center mb-4">
                <Rate
                  disabled
                  defaultValue={productForEdit.rating || 4}
                  allowHalf
                />
                <span className="text-gray-500 ml-2">
                  ({productForEdit.rating || 4})
                </span>
              </div>

              <div className="product-info__price">
                ₨ {productForEdit.price}
              </div>

              <div className="product-info__meta">
                <div className="product-info__meta-item">
                  <span className="product-info__meta-label">Brand</span>
                  <span className="product-info__meta-value">
                    <Tag color="blue">{productForEdit.brand?.title}</Tag>
                  </span>
                </div>

                <div className="product-info__meta-item">
                  <span className="product-info__meta-label">Categories</span>
                  <span className="product-info__meta-value">
                    {productForEdit.category?.map((cat) => (
                      <Tag key={cat._id} color="blue" className="mr-1">
                        {cat.title}
                      </Tag>
                    ))}
                  </span>
                </div>

                <div className="product-info__meta-item">
                  <span className="product-info__meta-label">Availability</span>
                  <span className="product-info__meta-value">
                    {productForEdit.countInStock > 0 ? (
                      productForEdit.countInStock <= 5 ? (
                        <Tag color="orange">Low Stock ({productForEdit.countInStock} left)</Tag>
                      ) : (
                        <Tag color="green">In Stock ({productForEdit.countInStock} available)</Tag>
                      )
                    ) : (
                      <Tag color="red">Out of Stock</Tag>
                    )}
                  </span>
                </div>
              </div>

              {/* Stock Quantity Display */}
              <div className="mb-6 mt-2">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Quantity in Stock:</span>
                  <span className="text-lg font-bold">
                    {productForEdit.countInStock}
                  </span>
                </div>

                {/* Stock Level Indicator */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        productForEdit.countInStock === 0
                          ? 'bg-red-500'
                          : productForEdit.countInStock <= 5
                            ? 'bg-orange-500'
                            : productForEdit.countInStock <= 20
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (productForEdit.countInStock / 50) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50+</span>
                  </div>
                </div>
              </div>

              <div className="product-info__description">
                {productForEdit.description.substring(0, 200)}
                {productForEdit.description.length > 200 && '...'}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-32">
                  <InputNumber
                    min={1}
                    max={productForEdit.countInStock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full"
                    disabled={productForEdit.countInStock <= 0}
                  />
                </div>
                {productForEdit.countInStock > 0 && (
                  <div className="text-xs text-gray-500">
                    Maximum: {productForEdit.countInStock} units
                  </div>
                )}

                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  className="bg-black text-white hover:bg-gray-800 border-none"
                  disabled={productForEdit.countInStock <= 0}
                >
                  {productForEdit.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button
                  type="default"
                  size="large"
                  icon={<HeartOutlined />}
                  onClick={() => message.info("Wishlist feature coming soon!")}
                >
                  Wishlist
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="text"
                  icon={<ShareAltOutlined />}
                  onClick={() => message.info("Share feature coming soon!")}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <Tabs
            defaultActiveKey="1"
            activeKey={activeTab}
            onChange={setActiveTab}
            className="px-6 pb-6"
          >
            <TabPane tab="Description" key="1">
              <div className="py-4">
                <p className="whitespace-pre-line">{productForEdit.description}</p>
              </div>
            </TabPane>
            <TabPane tab="Specifications" key="2">
              <div className="py-4">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium bg-gray-50">Brand</td>
                      <td className="py-2 px-4">{productForEdit.brand?.title}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium bg-gray-50">Categories</td>
                      <td className="py-2 px-4">
                        {productForEdit.category?.map(cat => cat.title).join(', ')}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium bg-gray-50">Availability</td>
                      <td className="py-2 px-4">
                        {productForEdit.countInStock > 0 ? (
                          <span className="flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              productForEdit.countInStock <= 5
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}></span>
                            In Stock
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full mr-2 bg-red-500"></span>
                            Out of Stock
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium bg-gray-50">Quantity Available</td>
                      <td className="py-2 px-4">{productForEdit.countInStock} units</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium bg-gray-50">Stock Status</td>
                      <td className="py-2 px-4">
                        {productForEdit.countInStock === 0 && "Out of Stock"}
                        {productForEdit.countInStock > 0 && productForEdit.countInStock <= 5 && "Low Stock"}
                        {productForEdit.countInStock > 5 && productForEdit.countInStock <= 20 && "Medium Stock"}
                        {productForEdit.countInStock > 20 && "High Stock"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPane>
            <TabPane tab="Reviews" key="3">
              <div className="py-4 text-center">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Related Products Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          {getRelatedProducts().length > 0 ? (
            <Card />
          ) : (
            <p className="text-center text-gray-500 py-8">No related products found</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductView;
