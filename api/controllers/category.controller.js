import Category from "../models/category.model.js";
import mongoose from "mongoose";

/**
 * Create a new category
 */
export const categories = async (req, res) => {
  try {
    const { title, parent } = req.body;

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
        _id: cat._id.toString(),            // The category’s 'value' field as 'id'
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
        const parentInMap = categoryMap.get(cat.parent.toString());
        const childInMap = categoryMap.get(cat._id.toString());
        if (parentInMap && childInMap) {
          parentInMap.children.push(childInMap);
        }
      } else {
        // It's a root category
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

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, parent } = req.body;

    // Validate if `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // If parent is provided, validate the parent ID
    if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
      return res.status(400).json({ message: "Invalid parent ID" });
    }

    // Optionally, if parent is not null, ensure the parent category exists
    let parentCategory = null;
    if (parent) {
      parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        title,
        parent: parentCategory ? parentCategory._id : null,
      },
      { new: true } // to return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If there is a parent, update the parent's children array,
    // but we need to ensure we remove it from the old parent's children if changed.
    // For simplicity, let's do a small check:
    if (parentCategory) {
      // Make sure this category is in the parent's children array
      if (!parentCategory.children.includes(updatedCategory._id)) {
        parentCategory.children.push(updatedCategory._id);
        await parentCategory.save();
      }
    }

    // If the category had an old parent, remove it from old parent's children array if changed
    // This step requires us to know the old parent. We can do that by reading the category
    // before the update, or from updatedCategory if we stored old data.

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};

// DELETE /api/categories/:id
export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If this category has a parent, remove it from the parent's children array
    if (categoryToDelete.parent) {
      await Category.findByIdAndUpdate(categoryToDelete.parent, {
        $pull: { children: categoryToDelete._id },
      });
    }

    // If this category has children, we can either:
    // 1) Also delete them, or
    // 2) Make them all top-level (remove their parent).
    // For simplicity, let's assume we want to set them to top-level:
    if (categoryToDelete.children && categoryToDelete.children.length > 0) {
      await Category.updateMany(
        { _id: { $in: categoryToDelete.children } },
        { $set: { parent: null } }
      );
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully",
      categoryId: id,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};



