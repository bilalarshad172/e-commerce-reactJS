import React from 'react';
import Card from './Card';

const FeaturedProducts = () => {
  return (
    <section className="featured-products">
      <div className="container mx-auto px-4">
        <div className="featured-products__header">
          <h2 className="featured-products__title">Featured Products</h2>
          <p className="featured-products__subtitle">Handpicked products for you</p>
        </div>
        
        <Card limit={8} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
