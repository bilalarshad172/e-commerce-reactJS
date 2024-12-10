import React from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import Slider from "../../components/Slider";
import Footer from "../../components/Footer";

const ProductsListing = () => {
  

  return (
    <>
      <Header />
      <Slider/>
      <div className="mx-20 ">
        <h3 className="text-center text-2xl my-3">All Products</h3>
        <Card  />
      </div>
      <Footer/>
    </>
  );
};

export default ProductsListing;
