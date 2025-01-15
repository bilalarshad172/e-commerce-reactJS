import React from "react";
import ProductDetails from "./components/ProductDetails";
import ProductImages from "./components/ProductImages";
import CategoryAndTags from "./components/CategoryAndTags";
import PricingAndInventory from "./components/PricingAndInventory";
import { NavLink } from "react-router-dom";

const AddProduct = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mt-5">
        <div>
          <h className="text-xl font-semibold mb-3">Add Product Details</h>
          <p className="text-sm text-gray-500">
            Add product Info like Name, price Description etc
          </p>
        </div>
        <div className="">
          <NavLink
          to={"/admin/products/table"}  className="border rounded-md px-2 py-1 w-24 border-black text-black hover:bg-black hover:text-white">
            Cancel
          </NavLink>
          <button className="border rounded-md px-2 w-24 ms-2 py-1 bg-black text-white hover:opacity-80">
            Save
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-1 mt-5">
          <ProductDetails />
          <PricingAndInventory />
        </div>

        <div className="col-span-1 my-5">
          <ProductImages />
          <CategoryAndTags />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
