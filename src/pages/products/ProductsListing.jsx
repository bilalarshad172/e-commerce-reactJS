import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productSlice";
import Card from "../../components/Card";
import Header from "../../components/Header";

const ProductsListing = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch products on component mount
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <Header />
      <div className="mx-20 ">
        <h3 className="text-center text-2xl my-3">All Products</h3>

        <Card products={products} />
      </div>
    </>
  );
};

export default ProductsListing;
