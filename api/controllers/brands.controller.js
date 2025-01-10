import Brand from "../models/brands.model.js";

// Create a new brand
export const brands = async (req, res) => {
    const { title } = req.body;
    const newBrand = new Brand({ title });
    try {
        await newBrand.save();
        res.status(201).json({ message: "Brand created successfully", newBrand });
    } catch (error) {
        res.status(500).json({ message: "Error creating brand", error: error.message });
    }
};

// Get all brands
export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({message:"Brands retrieved succesfully", brands})
    } catch (error) {
        res.status(500).json({message:"Error retrieving brands", error: error.message})
    }
};

// Get a brand by ID
export const getBrandById = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findById(id);
        res.status(200).json({ message: "Brand retrieved successfully", brand });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving brand", error: error.message });
    }
}

// Update a brand
export const updateBrand = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, { title }, { new: true });
        res.status(200).json({ message: "Brand updated successfully", updatedBrand });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating brand", error: error.message });
    }
}

// Delete a brand
export const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        await Brand.findByIdAndDelete(id);
        res.status(200).json({ message: "Brand deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting brand", error: error.message });
    }
}