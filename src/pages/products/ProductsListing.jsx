import React from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";

const ProductsListing = () => {
  

  return (
    <>
      <Header />
      <div className="mx-20 ">
        <h3 className="text-center text-2xl my-3">All Products</h3>
        <Card  />
      </div>
    </>
  );
};

export default ProductsListing;
