import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";

const Card = () => {
  
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  console.log(products);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch products on component mount
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  
  if (!products || products.length === 0) {
    return <p className="text-center">No products available.</p>;
  }

  const handleProductView = (id) => {
    navigate(`/products/${id}`); // Navigate to product details page with dynamic ID
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 " >
      {products.map((product) => (
        <div key={product._id} onClick={() => handleProductView(product._id)} className="group border rounded shadow-md p-4 transform transition duration-300 hover:scale-105 cursor-pointer">
          <img
            src={product.image}
            alt={product.title}
            className="h-40 mx-auto"
          />
          <h4 className="font-bold">{product.title}</h4>
          <p>${product.price}</p>
          {/* <p>${product.category}</p> */}
        </div>
      ))}
    </div>
  );
};

export default Card;
