import Product from '../models/product.model.js';

export const products = async (req, res) => {

    const { title, description, price, category, brand, image } = req.body;
    const newProduct = new Product({ title, description, price, category, brand, image });
    try {
        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};
export const getProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ message: "Products retrieved succesfully", products })
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products", error: error.message })
    }

};