import Product from '../models/product.model.js';

export const products = async (req, res) => {

    const { title, description, price, countInStock, category,brand, images } = req.body;
    const newProduct = new Product({ title, description, price,countInStock, category, brand, images });
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

export const getProductById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    try {
        const product = await Product.findById(id).populate("brand", "title").populate("category", "title");
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product retrieved successfully", product });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving product", error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    try {
        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {           
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // or _id if your route is :_id
    const updatedData = req.body;
    
    // For Mongoose:
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true, // returns the updated doc
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
