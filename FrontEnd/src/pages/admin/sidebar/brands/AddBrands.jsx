import React from "react";

const AddBrands = () => {
  
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="flex items-center justify-between mx-5">
        <h3 className=" mt-2 text-xl font-semibold">Add Brands</h3>
        <button className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white">
          Save
        </button>
      </div>
      <div className="flex flex-col my-3">
        <label className="mx-5 font-semibold">Brand Name</label>
        <input type="text" className="border rounded mx-5 p-1" id="cat_name" />
      </div>
    </div>
  );
};

export default AddBrands;
