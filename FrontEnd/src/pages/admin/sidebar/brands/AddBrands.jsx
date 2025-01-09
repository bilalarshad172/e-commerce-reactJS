import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBrand } from "../../../../redux/brandsSlice";
import { useNavigate, Link } from "react-router-dom";

const AddBrands = () => {
  const [brand, setBrand] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBrand(brand));
    if (!brand.title) {
      alert("Please enter brand name");
      return;
    }
    navigate("/admin/brands");
  };
  return (
    <div className="border rounded-md shadow-md mt-5">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mx-5">
          <h3 className=" mt-2 text-xl font-semibold">Add Brands</h3>
          <button type="submit" className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white">
            Save
          </button>
        </div>
        <div className="flex flex-col my-3">
          <label className="mx-5 font-semibold">Brand Name</label>
          <input
            type="text"
            className="border rounded mx-5 p-1"
            id="cat_name"
            name="cat_name"
            onChange={(e) => setBrand({ ...brand, title: e.target.value })}
          />
        </div>
      </form>
    </div>
  );
};

export default AddBrands;
