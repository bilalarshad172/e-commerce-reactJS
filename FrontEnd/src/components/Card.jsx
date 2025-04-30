import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { AddtoCart } from "../redux/cartSlice";
import defaultImage from "../assets/default.png";
import { Spin, Rate, message, Button, Tooltip } from "antd";
import { FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";

const Card = ({ categoryFilter, limit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const { products, loadingAllProducts, error } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch products on component mount
    dispatch(fetchProducts())
      .unwrap()
      .catch((err) => {
        // If the error is "Unauthorized", redirect
        if (err === "Unauthorized") {
          navigate("/");
        }
      });
  }, [dispatch, navigate]);

  // Filter products by category if categoryFilter is provided
  const filteredProducts = categoryFilter
    ? products?.filter(product =>
        product.category?.some(cat => cat.title === categoryFilter)
      )
    : products;

  // Limit the number of products if limit is provided
  const displayedProducts = limit && filteredProducts
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  if (loadingAllProducts)
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">Error: {error}</p>
        <Button
          onClick={() => dispatch(fetchProducts())}
          className="mt-4 bg-black text-white hover:bg-gray-800"
        >
          Try Again
        </Button>
      </div>
    );

  if (!displayedProducts || displayedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">No products available.</p>
        {categoryFilter && (
          <p className="text-gray-500">
            No products found in the "{categoryFilter}" category.
          </p>
        )}
      </div>
    );
  }

  const handleProductView = (id) => {
    navigate(`/products/${id}`); // Navigate to product details page with dynamic ID
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation to product page

    if (!user) {
      message.warning("Please log in to add items to your cart");
      return;
    }

    const cartData = {
      user: user._id,
      cartItems: [
        {
          product: product._id,
          quantity: 1
        }
      ]
    };

    dispatch(AddtoCart(cartData))
      .unwrap()
      .then(() => {
        message.success(`${product.title} added to cart`);
      })
      .catch((err) => {
        message.error(`Failed to add to cart: ${err}`);
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayedProducts.map((product) => {
        // Check if there's at least one image
        const imageSrc =
          product.images && product.images.length > 0
            ? product.images[0]
            : defaultImage;

        // Check if this product is new (less than 14 days old)
        const isNew = new Date(product.createdAt) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        return (
          <div
            key={product._id}
            className="card product-card"
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Badge for new products */}
            {isNew && (
              <span className="badge badge-accent product-card__badge">
                NEW
              </span>
            )}

            {/* Product Image */}
            <div
              className="product-card__image-container"
              onClick={() => handleProductView(product._id)}
            >
              <img
                src={imageSrc}
                alt={product.title}
                onError={handleImageError}
                className="product-card__image"
              />

              {/* Quick actions that appear on hover */}
              {hoveredProduct === product._id && (
                <div className="product-card__actions">
                  <div className="flex gap-3">
                    <Tooltip title="Quick view">
                      <Button
                        type="text"
                        icon={<FaEye color="white" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductView(product._id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Add to cart">
                      <Button
                        type="text"
                        icon={<FaShoppingCart color="white" />}
                        onClick={(e) => handleAddToCart(e, product)}
                      />
                    </Tooltip>
                    <Tooltip title="Add to wishlist">
                      <Button
                        type="text"
                        icon={<FaHeart color="white" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          message.info("Wishlist feature coming soon!");
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {/* Product Content */}
            <div
              className="product-card__content"
              onClick={() => handleProductView(product._id)}
            >
              {/* Product Category */}
              {product.category && product.category.length > 0 && (
                <div className="text-xs text-gray-500 mb-1">
                  {product.category[0].title}
                </div>
              )}

              {/* Product Title */}
              <h3 className="product-card__title truncate" title={product.title}>
                {product.title}
              </h3>

              {/* Product Rating */}
              <div className="flex items-center mb-2">
                <Rate
                  disabled
                  defaultValue={product.rating || 0}
                  allowHalf
                  style={{ fontSize: '14px' }}
                />
                <span className="text-xs text-gray-500 ml-1">
                  ({product.rating || 0})
                </span>
              </div>

              {/* Product Price */}
              <div className="product-card__price">
                ₨ {product.price}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
