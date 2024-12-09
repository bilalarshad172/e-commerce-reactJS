import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ products }) => {
  const navigate = useNavigate();
  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  const handleProductView = () => {
    navigate("/products/1");
    console.log("Product clicked");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" onClick={handleProductView}>
      {products.map((product) => (
        <div key={product.id} className="group border rounded shadow-md p-4 transform transition duration-300 hover:scale-105">
          <img
            src={product.image}
            alt={product.title}
            className="h-40 mx-auto"
          />
          <h4 className="font-bold">{product.title}</h4>
          <p>${product.price}</p>
          <p>${product.category}</p>
        </div>
      ))}
    </div>
  );
};

export default Card;
