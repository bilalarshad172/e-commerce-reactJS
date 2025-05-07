import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Empty, Breadcrumb, Select, Pagination, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fetchProducts } from "../../redux/productSlice";
import { fetchCategories } from "../../redux/categorySlice";
import ProductCard from "../../components/ProductCard";

const { Option } = Select;

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  const categoryParam = queryParams.get("category") || "";
  
  // Local state
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Redux state
  const { products, loadingAllProducts } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);
  
  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Update search term when URL query changes
  useEffect(() => {
    setSearchTerm(searchQuery);
    setSelectedCategory(categoryParam);
  }, [searchQuery, categoryParam]);
  
  // Filter products based on search term and category
  const filteredProducts = products?.filter(product => {
    const matchesSearch = searchTerm 
      ? product.title?.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
      
    const matchesCategory = selectedCategory 
      ? product.category?.some(cat => 
          cat._id === selectedCategory || cat.title?.toLowerCase() === selectedCategory.toLowerCase()
        ) 
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  // Pagination
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Handle search form submission
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("query", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    
    navigate(`/products/search?${params.toString()}`);
    setCurrentPage(1);
  };
  
  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(location.search);
    
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    
    if (searchTerm) params.set("query", searchTerm);
    navigate(`/products/search?${params.toString()}`);
    setCurrentPage(1);
  };
  
  // Handle pagination change
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/products">Home</Breadcrumb.Item>
          <Breadcrumb.Item>Search Results</Breadcrumb.Item>
          {searchTerm && <Breadcrumb.Item>{searchTerm}</Breadcrumb.Item>}
        </Breadcrumb>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
              suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
              size="large"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              placeholder="Filter by Category"
              onChange={handleCategoryChange}
              value={selectedCategory || undefined}
              style={{ width: '100%' }}
              size="large"
              allowClear
            >
              {categories?.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.title}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {searchTerm 
              ? `Search results for "${searchTerm}"` 
              : selectedCategory 
                ? `Products in ${categories?.find(c => c._id === selectedCategory)?.title || selectedCategory}` 
                : "All Products"}
          </h1>
          <p className="text-gray-600">
            {filteredProducts?.length || 0} products found
          </p>
        </div>
        
        {/* Loading State */}
        {loadingAllProducts && (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        )}
        
        {/* No Results */}
        {!loadingAllProducts && (!filteredProducts || filteredProducts.length === 0) && (
          <div className="py-12 text-center">
            <Empty 
              description={
                <span>
                  No products found for your search
                  {searchTerm && <span> "{searchTerm}"</span>}
                  {selectedCategory && categories?.find(c => c._id === selectedCategory) && 
                    <span> in {categories.find(c => c._id === selectedCategory).title}</span>
                  }
                </span>
              } 
            />
          </div>
        )}
        
        {/* Product Grid */}
        {!loadingAllProducts && paginatedProducts && paginatedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredProducts && filteredProducts.length > pageSize && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['12', '24', '36', '48']}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
