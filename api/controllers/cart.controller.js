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
      select: "title price images", // Only get relevant product fields
    });

    if (!cart) {
      return res.status(200).json({ cartItems: [] }); // Return empty cartItems array if no cart found
    }

    // Get the original length before filtering
    const originalLength = cart.cartItems.length;

    // Filter out any cart items where the product no longer exists (was deleted)
    cart.cartItems = cart.cartItems.filter(item => item.product !== null);

    // Save the cart if any items were filtered out
    if (cart.cartItems.length < originalLength) {
      await cart.save();
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Filter out the item to remove
    cart.cartItems = cart.cartItems.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    // Return the updated cart with populated product data
    const updatedCart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      select: "title price images",
    });

    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItems } = req.body;

    if (!userId || !cartItems) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Update quantities for each item
    cartItems.forEach(({ product, quantity }) => {
      const item = cart.cartItems.find(
        item => item.product.toString() === product
      );

      if (item) {
        item.quantity = quantity;
      }
    });

    await cart.save();

    // Return the updated cart with populated product data
    const updatedCart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      select: "title price images",
    });

    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
