import Category from "../models/category.model.js";

export const categories = async (req, res) => {
  try {
    const { title, value, parent } = req.body;

    // Create new category
    const category = new Category({ title, value, parent });
    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating category", error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    // Check if categories are fetched
    if (!categories.length) {
      return res.status(200).json({
        message: "No categories found",
        categories: [],
      });
    }

    // Create a map to store categories by their ID
    const categoryMap = new Map();
    categories.forEach((category) => {
      categoryMap.set(category._id.toString(), {
        value: category._id.toString(),
        title: category.title,
        children: [],
      });
    });

    // Build the tree structure
    const rootCategories = [];
    categories.forEach((category) => {
      if (category.parent) {
        // Check if the parent exists in the map
        const parentCategory = categoryMap.get(category.parent.toString());
        if (parentCategory) {
          parentCategory.children.push(
            categoryMap.get(category._id.toString())
          );
        } else {
          // If parent is missing, treat as a root category
          console.warn(
            `Parent category with ID ${category.parent} not found for category ${category.title}. Treating as root category.`
          );
          rootCategories.push(categoryMap.get(category._id.toString()));
        }
      } else {
        // If no parent, it's a root category
        rootCategories.push(categoryMap.get(category._id.toString()));
      }
    });

    // Return the response
    res.status(200).json({
      message: "Categories Tree Structure retrieved successfully",
      categories: rootCategories,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving categories",
      error: err.message,
    });
  }
};
