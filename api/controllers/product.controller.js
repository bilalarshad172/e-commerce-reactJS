import Product from '../models/product.model.js';

export const products = async (req, res) => {

    const { title, description, price, countInStock, category,brand, image } = req.body;
    const newProduct = new Product({ title, description, price,countInStock, category, brand, image });
    try {
        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};
export const getProduct = async (req, res) => {
    try {
    // The second argument to populate tells Mongoose which fields you want
    // from the Brand document. (e.g., 'title' or multiple fields like 'title description')
    const products = await Product.find({})
      .populate("brand", "title")
      .populate("category", "title"); // if you also want category's title

    res.json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};