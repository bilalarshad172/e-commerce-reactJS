import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TreeSelect, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchCategories, addCategory } from "../../../../redux/categorySlice";

const AddCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the form
  const [title, setTitle] = useState("");
  const [parentCategory, setParentCategory] = useState(null);

  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );
  console.log(categories);
  // Fetch all categories for the dropdown
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onChangeTreeSelect = (newParentId) => {
    console.log(newParentId);
    setParentCategory(newParentId);
    
  };

  
  const transformCategories = (categories) => {
  return categories.map((category) => ({
    title: category.title, // Display text
    value: category._id,   // Unique value
    children: category.children ? transformCategories(category.children) : null, // Recursively map children
  }));
  };
  const treeData = transformCategories(categories);
  // Handle form submission
  const handleSaveCategory = async () => {
    // Build a category payload for the server
    const categoryData = {
      title,// The unique slug/identifier
      parent: parentCategory,
    };

    // Dispatch Redux action
   try {
    await dispatch(addCategory(categoryData)).unwrap();
    setTitle("");
     setParentCategory(null);
     message.success("Category added successfully!");
      navigate("/admin/categories");
  } catch (error) {
    console.error("Failed to add category:", error);
    message.error(error); // Display a toast notification or error message
  }
  };

  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="flex items-center justify-between mx-5">
        <h3 className=" mt-2 text-xl font-semibold">Add Categories</h3>
        <button
          className="border rounded-md px-2 py-1 mt-3 border-black text-black hover:bg-black hover:text-white"
          onClick={handleSaveCategory}
        >
          Save
        </button>
      </div>

      <div className="flex flex-col mt-3">
        <label className="mx-5 font-semibold">Category Name</label>
        <input
          type="text"
          className="border rounded mx-5 p-1"
          id="cat_name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>


      <div className="flex flex-col mb-5">
        <label className="mx-5 font-semibold">Parent Category Name</label>
        <TreeSelect
          showSearch
          style={{
            marginRight: "1.25rem",
            marginLeft: "1.25rem",
          }}
          value={parentCategory}
          dropdownStyle={{
            maxHeight: 400,
            overflow: "auto",
          }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          onChange={onChangeTreeSelect}
          // If you don't need multiple parent categories, remove `multiple`
          treeData={treeData}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddCategories;
