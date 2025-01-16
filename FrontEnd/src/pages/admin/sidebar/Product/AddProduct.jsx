import React, { useState, useEffect } from "react";
import ProductDetails from "./components/ProductDetails";
import ProductImages from "./components/ProductImages";
import CategoryAndTags from "./components/CategoryAndTags";
import PricingAndInventory from "./components/PricingAndInventory";
import {
  createProduct,
  resetCreateStatus,
} from "../../../../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { message } from "antd";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const { loading, error, createSuccess } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (createSuccess) {
      message.success("Product created!");
      dispatch(resetCreateStatus());
      navigate("/admin/products/table");
    } else if (error) {
      message.error(`Failed: ${error}`);
      dispatch(resetCreateStatus());
    }
  }, [createSuccess, error, dispatch]);

  const handleSave = () => {
    const newProduct = {
      title,
      description,
      price,
      category,
      brand,
      countInStock,
      // For simplicity we just pick the first image or
      // you can store an array of image URLs if your backend supports it
      imageUrl: uploadedImages[0] || "",
      rating: 0, // or any default rating
    };

    // Dispatch the createProduct thunk
    dispatch(createProduct(newProduct));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mt-5">
        <div>
          <h3 className="text-xl font-semibold mb-3">Add Product Details</h3>
          <p className="text-sm text-gray-500">
            Add product Info like Name, price Description etc
          </p>
        </div>
        <div className="">
          <NavLink
            to={"/admin/products/table"}
            className="border rounded-md px-2 py-1 w-24 border-black text-black hover:bg-black hover:text-white"
          >
            Cancel
          </NavLink>
          <button
            onClick={handleSave}
            className="border rounded-md px-2 w-24 ms-2 py-1 bg-black text-white hover:opacity-80"
          >
            Save
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-1 mt-5">
          <ProductDetails
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          <PricingAndInventory
            price={price}
            setPrice={setPrice}
            countInStock={countInStock}
            setCountInStock={setCountInStock}
          />
        </div>

        <div className="col-span-1 my-5">
          <ProductImages
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
          <CategoryAndTags
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
