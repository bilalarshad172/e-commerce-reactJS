import Product from "../models/product.model.js";

// If you don't want to tie images to a product yet, you can skip the DB logic
// But here is how you might do it if you have productId from the frontend:
export const createProductImages = async (req, res) => {
  try {
    // If you don't have product ID yet, skip
    const { productId } = req.body; // optional

    // Array of files
    const files = req.files;

    // If for some reason no files were uploaded
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Extract file paths to store in DB
    // We'll store something like: `uploads/filename.jpg`
    const imagePaths = files.map((file) => {
      // E.g. "uploads/1681234354-123456789.jpg"
      return file.filename;
    });

    // If you want to store them in product
    // otherwise you can just return them
    let updatedProduct;
    if (productId) {
      // Find the product by ID and update
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: { images: { $each: imagePaths } },
        },
        { new: true }
      );
    }

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imagePaths,
      product: updatedProduct || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading images", error: error.message });
  }
};

// Example for retrieving product images
export const getProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ images: product.images || [] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving images", error: error.message });
  }
};
