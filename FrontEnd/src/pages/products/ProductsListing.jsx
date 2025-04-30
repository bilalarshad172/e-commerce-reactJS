import React from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import Slider from "../../components/Slider";
import Footer from "../../components/Footer";
import FeaturedProducts from "../../components/FeaturedProducts";
import CategoriesShowcase from "../../components/CategoriesShowcase";

const ProductsListing = () => {
  return (
    <>
      <Header />
      <Slider />

      <FeaturedProducts />

      <CategoriesShowcase />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our Products</h2>
          <p className="text-gray-600">Explore our wide range of products</p>
        </div>
        <Card />
      </div>

      <Footer />
    </>
  );
};

export default ProductsListing;
