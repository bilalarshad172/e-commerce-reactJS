import React, { useState, useEffect } from "react";
import ProductDetails from "./components/ProductDetails";
import ProductImages from "./components/ProductImages";
import CategoryAndTags from "./components/CategoryAndTags";
import PricingAndInventory from "./components/PricingAndInventory";
import {
  createProduct,
  resetCreateStatus,
  updateProduct,
  fetchProductById
} from "../../../../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

const AddProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [countInStock, setCountInStock] = useState();
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const { loading, productForEdit, error, createSuccess } = useSelector(
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

   useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    } else {
      // If no id, clear out any leftover product from state
      // (not strictly necessary if your slice does it on mount)
    }
   }, [id, dispatch]);
  
  useEffect(() => {
    if (id && productForEdit) {
      setTitle(productForEdit.title || "");
      setDescription(productForEdit.description || "");
      setPrice(productForEdit.price || "");
      setCountInStock(productForEdit.countInStock || "");
      setCategory(productForEdit.category.map(cat => cat._id));
      setBrand(productForEdit.brand._id || "");
      // If your product has images array, set those
      setUploadedImages(productForEdit.images || []);
    }
  }, [id, productForEdit]);

  const handleSave = () => {
    // Build the payload
    const productData = {
      title,
      description,
      price,
      countInStock,
      category,
      brand,
      images: uploadedImages,
      // Or whichever fields your backend requires
    };

    // If editing, dispatch updateProduct
    if (id) {
      dispatch(updateProduct({ id, ...productData }))
        .unwrap() // if you're using RTK, unwrap helps with error handling
        .then(() => {
          // On success, maybe navigate back to product listing
          navigate("/admin/products/table");
        })
        .catch((err) => {
          console.error("Update error:", err);
        });
    } else {
      // If adding, dispatch createProduct
      dispatch(createProduct(productData))
        .unwrap()
        .then(() => {
          // On success, navigate back or show success
          navigate("/admin/products/table");
        })
        .catch((err) => {
          console.error("Create error:", err);
        });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mt-5">
        <div>
          <h3 className="text-xl font-semibold mb-3">{id ? "Edit Product Details" : "Add Product Details"}</h3>
          <p className="text-sm text-gray-500">
            {id
              ? "Update existing product details here"
              : "Add product Info like Name, price Description etc"}
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
