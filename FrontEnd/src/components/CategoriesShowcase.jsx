import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/categorySlice';

const CategoriesShowcase = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.categories);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Default images for categories if they don't have one
  const defaultImages = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  ];
  
  if (loading) {
    return (
      <section className="categories-showcase">
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Spin size="large" />
        </div>
      </section>
    );
  }
  
  if (!categories || categories.length === 0) {
    return null;
  }
  
  // Take only the first 6 categories
  const displayedCategories = categories.slice(0, 6);
  
  return (
    <section className="categories-showcase">
      <div className="container mx-auto px-4">
        <div className="categories-showcase__header">
          <h2 className="categories-showcase__title">Shop by Category</h2>
          <p className="categories-showcase__subtitle">Find what you're looking for</p>
        </div>
        
        <div className="categories-showcase__grid">
          {displayedCategories.map((category, index) => (
            <Link 
              to={`/products?category=${category._id}`} 
              key={category._id}
              className="category-card"
            >
              <img 
                src={defaultImages[index % defaultImages.length]} 
                alt={category.title}
                className="category-card__image"
              />
              <div className="category-card__content">
                <h3 className="category-card__title">{category.title}</h3>
                <span className="category-card__count">
                  {category.productCount || 'Browse products'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;
