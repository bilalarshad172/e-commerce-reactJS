import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, Badge, Tag, Button, message } from "antd";
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined } from "@ant-design/icons";
import DefaultImage from "../assets/default.png";
import { AddtoCart } from "../redux/cartSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle image loading error
  const handleImageError = (e) => {
    e.target.src = DefaultImage;
  };
  
  // Navigate to product detail page
  const handleViewProduct = () => {
    navigate(`/products/${product._id}`);
  };
  
  // Add product to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (product.countInStock <= 0) {
      message.error("This product is out of stock");
      return;
    }
    
    dispatch(AddtoCart({ 
      product: product._id, 
      title: product.title, 
      price: product.price, 
      image: product.images?.[0] || DefaultImage,
      quantity: 1,
      countInStock: product.countInStock
    }));
    
    message.success(`${product.title} added to cart`);
  };
  
  // Get stock status
  const getStockStatus = () => {
    if (product.countInStock <= 0) return { text: "Out of Stock", color: "error" };
    if (product.countInStock < 10) return { text: "Low Stock", color: "warning" };
    return { text: "In Stock", color: "success" };
  };
  
  const stockStatus = getStockStatus();
  
  return (
    <Card
      hoverable
      className="product-card h-full flex flex-col"
      cover={
        <div 
          className="product-card__image-container relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            alt={product.title}
            src={product.images?.[0] || DefaultImage}
            onError={handleImageError}
            className="product-card__image object-cover h-64 w-full transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          
          {/* Quick action buttons that appear on hover */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EyeOutlined />} 
              onClick={handleViewProduct}
              className="bg-white text-black border-none hover:bg-gray-100"
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<ShoppingCartOutlined />} 
              onClick={handleAddToCart}
              disabled={product.countInStock <= 0}
              className="bg-white text-black border-none hover:bg-gray-100"
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<HeartOutlined />} 
              className="bg-white text-black border-none hover:bg-gray-100"
            />
          </div>
          
          {/* Stock status badge */}
          <Badge.Ribbon 
            text={stockStatus.text} 
            color={stockStatus.color}
            className="absolute top-0 right-0"
          />
        </div>
      }
      onClick={handleViewProduct}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1">
        {/* Category tags */}
        <div className="mb-2">
          {product.category?.map((cat) => (
            <Tag key={cat._id} className="mr-1 mb-1">
              {cat.title}
            </Tag>
          ))}
        </div>
        
        {/* Product title */}
        <h3 className="text-lg font-medium mb-1 line-clamp-2">{product.title}</h3>
        
        {/* Brand */}
        {product.brand && (
          <p className="text-gray-500 text-sm mb-2">{product.brand.title}</p>
        )}
      </div>
      
      {/* Price and add to cart */}
      <div className="mt-auto pt-4 flex justify-between items-center">
        <span className="text-xl font-bold">${product.price?.toFixed(2)}</span>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={product.countInStock <= 0}
          className="bg-black text-white border-none hover:bg-gray-800"
        >
          Add
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
