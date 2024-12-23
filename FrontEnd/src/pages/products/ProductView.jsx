import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import {
  fetchProductById,
  clearSelectedProduct,
} from "../../redux/productSlice";

const ProductView = () => {
  const [quantity, setQuantity] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  useEffect(() => {
    // Fetch product by ID
    dispatch(fetchProductById(id));
    // Cleanup: Clear selected product when component unmounts
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };
  const removeQuantity = () => {
    setQuantity(quantity - 1);
  };

  if (loading)
    return <p className="text-center mt-5">Loading product details...</p>;
  if (error) return <p className="text-center mt-5">Error: {error}</p>;
  if (!selectedProduct)
    return <p className="text-center mt-5">Product not found.</p>;
  return (
    <>
      <Header />
      <div className=" gap-20 mt-10 mx-20 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-42 items-center">
          {/* Image Container */}
          <div className="">
            <div className="w-full max-w-lg h-96  flex items-center justify-center overflow-hidden">
              <img
                className="w-full h-full object-contain"
                src={selectedProduct.image}
                alt={selectedProduct.title}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className=" min-h-96 max-h-full">
            <h1 className="text-2xl text-center font-sans font-bold mb-4">
              {selectedProduct.title}
            </h1>
            <h2 className="text-2xl text-center font-bold">
              ${selectedProduct.price}
            </h2>
            <div className="flex flex-col items-center justify-center gap-2">
              <h6 className="text-xl font-semibold"> Select Quantity</h6>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 bg-black pb-1 text-xl text-white text-center rounded-full border flex items-center justify-center"
                  onClick={removeQuantity}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="w-10 h-10 bg-black pb-1 text-xl text-white text-center rounded-full border flex items-center justify-center"
                  onClick={addQuantity}
                >
                  +
                </button>
              </div>
              <button className="border rounded-xl w-1/3 py-1 bg-black text-white hover:opacity-80">
                Add to cart
              </button>
            </div>
            <div className="px-3 mt-2">
              <h4 className="text-xl font-semibold"> Product Description</h4>
              <hr className="my-2" />
              <p className="py-1">{selectedProduct.description}</p>
            </div>
          </div>
        </div>

        
      </div>
      <Footer />
    </>
  );
};

export default ProductView;
