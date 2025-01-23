import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import defaultImage from "../assets/default.png";
import {Spin} from 'antd';
const Card = () => {
  const dispatch = useDispatch();
  const { products, loadingAllProducts, error } = useSelector((state) => state.products);
  
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch products on component mount
  
    dispatch(fetchProducts());
  
  }, [dispatch]);

  if (loadingAllProducts) return <p className="text-center"><Spin size="large" /></p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (!products || products.length === 0) {
    return <p className="text-center">No products available.</p>;
  }

  const handleProductView = (id) => {
    navigate(`/products/${id}`); // Navigate to product details page with dynamic ID
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
      {products.map((product) => {
        // Check if there's at least one image
        const imageSrc =
          product.images && product.images.length > 0
            ? product.images[0]
            : defaultImage;

        return (
          <div
            key={product._id}
            onClick={() => handleProductView(product._id)}
            className="group border rounded shadow-md p-4 transform transition duration-300 hover:scale-105 cursor-pointer"
          >
            <img
              src={imageSrc}
              alt={product.title}
              onError={handleImageError}
              className="h-40 mx-auto object-contain"
            />
            <h4 className="font-bold">{product.title}</h4>
            <p>${product.price}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
