import Category from "../models/category.model.js";
import mongoose from "mongoose";

/**
 * Create a new category
 */
export const categories = async (req, res) => {
  try {
    const { title, value, parent } = req.body;

    console.log("Parent ID received:", parent);

    // Validate parent ID if present
    if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
      console.error("Invalid Parent ID:", parent);
      return res.status(400).json({ message: "Invalid parent ID" });
    }

    // Optional: Check if the parent actually exists
    let parentCategory = null;
    if (parent) {
      parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    // Create the category (child or root)
    const category = new Category({
      title,
      value,
      parent: parentCategory ? parentCategory._id : null,
    });

    await category.save();

    // If there is a parent, update the parent's children array
    if (parentCategory) {
      await Category.findByIdAndUpdate(parentCategory._id, {
        $push: { children: category._id },
      });
    }

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({
      message: "Error creating category",
      error: error.message,
    });
  }
};

/**
 * Get categories in a hierarchical tree structure
 */
export const getCategory = async (req, res) => {
  try {
    // Fetch all categories
    const allCategories = await Category.find();

    if (!allCategories.length) {
      return res.status(200).json({
        message: "No categories found",
        categories: [],
      });
    }

    // Create a map to store categories by their stringified _id
    const categoryMap = new Map();
    allCategories.forEach((cat) => {
      categoryMap.set(cat._id.toString(), {
        // These are the fields you want to return
        value: cat._id.toString(), // Unique internal ID as 'value'
        id: cat.value,            // The category’s 'value' field as 'id'
        title: cat.title,
        // We'll fill `children` after we link them up
        children: cat.children.length ? [] : null,
      });
    });

    // Array to hold the top-level (root) categories
    const rootCategories = [];

    // Link each category to its parent (if any)
    allCategories.forEach((cat) => {
      if (cat.parent) {
        // If cat has a parent, find the parent in the map
        const parentInMap = categoryMap.get(cat.parent.toString());
        // Then find the child in the map
        const childInMap = categoryMap.get(cat._id.toString());

        if (parentInMap && childInMap) {
          parentInMap.children = parentInMap.children || [];
          parentInMap.children.push(childInMap);
        }
      } else {
        // If no parent => it's a root category
        rootCategories.push(categoryMap.get(cat._id.toString()));
      }
    });

    res.status(200).json({
      message: "Categories Tree Structure retrieved successfully",
      categories: rootCategories,
    });
  } catch (err) {
    console.error("Error retrieving categories:", err.message);
    res.status(500).json({
      message: "Error retrieving categories",
      error: err.message,
    });
  }
};
