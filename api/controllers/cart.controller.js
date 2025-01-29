import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  try {
    const { user, cartItems } = req.body; // Extract cartItems as an array

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ error: "Cart items are required." });
    }

    let cart = await Cart.findOne({ user });

    if (cart) {
      cartItems.forEach(({ product, quantity }) => {
        const item = cart.cartItems.find(
          (item) => item.product.toString() === product
        );
        if (item) {
          item.quantity += quantity;
        } else {
          cart.cartItems.push({ product, quantity });
        }
      });
      await cart.save();
    } else {
      cart = await Cart.create({ user, cartItems });
    }

    return res.status(201).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      select: "title price images ", // Only get relevant product fields
    });
    console.log(cart);

    if (!cart) {
      return res.status(200).json({ cartItems: [] }); // Return empty cartItems array if no cart found
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {};

export const updateCart = async (req, res) => {};
