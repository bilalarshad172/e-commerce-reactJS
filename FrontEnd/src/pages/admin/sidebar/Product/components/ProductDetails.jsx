import React from "react";

const ProductDetails = ({ title, setTitle, description, setDescription }) => {
  return (
    <div className="border rounded-md shadow-md ">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">General Information</h3>
        <div className="flex flex-col mt-3">
          <label className="mx-5 font-semibold">Product Name</label>
          <input type="text" className="border rounded mx-5 p-1" value={title} onChange={(e) => setTitle(e.target.value)} id="pro_name" />
        </div>
        <div className="flex flex-col">
          <label className="mx-5 font-semibold">Product Description</label>
          <textarea className="border rounded mx-5 p-1" value={description}  onChange={(e) => setDescription(e.target.value)} rows={10} id="pro_desc" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
