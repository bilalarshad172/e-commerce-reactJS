import Brand from "../models/brands.model.js";

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

export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({message:"Brands retrieved succesfully", brands})
    } catch (error) {
        res.status(500).json({message:"Error retrieving brands", error: error.message})
    }
};