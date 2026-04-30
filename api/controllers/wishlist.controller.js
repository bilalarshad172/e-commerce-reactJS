import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

const populateWishlist = (query) =>
  query.populate({
    path: "items.product",
    select: "title price images countInStock brand category",
    populate: [
      { path: "brand", select: "title" },
      { path: "category", select: "title" },
    ],
  });

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await populateWishlist(Wishlist.findOne({ user: userId }));

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json(wishlist);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch wishlist", details: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ error: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (!alreadyExists) {
      wishlist.items.push({ product: productId });
      await wishlist.save();
    }

    const populatedWishlist = await populateWishlist(
      Wishlist.findById(wishlist._id)
    );
    return res.status(200).json(populatedWishlist);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add wishlist item", details: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );
    await wishlist.save();

    const populatedWishlist = await populateWishlist(
      Wishlist.findById(wishlist._id)
    );
    return res.status(200).json(populatedWishlist);
  } catch (error) {
    return res.status(500).json({ error: "Failed to remove wishlist item", details: error.message });
  }
};
