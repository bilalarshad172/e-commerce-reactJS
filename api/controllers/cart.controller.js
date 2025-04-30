import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import {
  checkInventoryAvailability,
  reserveInventory,
  releaseReservation,
  getAvailableQuantity
} from "../services/inventory.service.js";

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

    // Check inventory availability for each product
    for (const item of cartItems) {
      const { product, quantity } = item;

      // Check if product exists
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(400).json({
          error: "Product not found",
          productId: product
        });
      }

      // Check if product has enough inventory
      const isAvailable = await checkInventoryAvailability(product, quantity);
      if (!isAvailable) {
        const availableQty = await getAvailableQuantity(product);
        return res.status(400).json({
          error: "Not enough inventory available",
          productId: product,
          productTitle: productExists.title,
          requestedQuantity: quantity,
          availableQuantity: availableQty
        });
      }

      // Reserve the inventory
      await reserveInventory(user, product, quantity);
    }

    let cart = await Cart.findOne({ user });

    if (cart) {
      // Process each cart item
      for (const { product, quantity } of cartItems) {
        const item = cart.cartItems.find(
          (item) => item.product.toString() === product
        );
        if (item) {
          item.quantity += quantity;
        } else {
          cart.cartItems.push({ product, quantity });
        }
      }
      await cart.save();
    } else {
      cart = await Cart.create({ user, cartItems });
    }

    // Return the cart with populated product data
    const populatedCart = await Cart.findOne({ user }).populate({
      path: "cartItems.product",
      select: "title price images countInStock",
    });

    return res.status(201).json(populatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
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
      select: "title price images countInStock", // Include inventory information
    });

    if (!cart) {
      return res.status(200).json({ cartItems: [] }); // Return empty cartItems array if no cart found
    }

    // Get the original length before filtering
    const originalLength = cart.cartItems.length;

    // Filter out any cart items where the product no longer exists (was deleted)
    cart.cartItems = cart.cartItems.filter(item => item.product !== null);

    // Check inventory availability for each item
    const cartItemsWithAvailability = await Promise.all(
      cart.cartItems.map(async (item) => {
        if (!item.product) return item;

        // Get available quantity for this product
        const availableQuantity = await getAvailableQuantity(item.product._id);

        // Add availability information to the item
        return {
          ...item.toObject(),
          availableQuantity,
          inStock: availableQuantity > 0,
          hasEnoughStock: availableQuantity >= item.quantity
        };
      })
    );

    // Save the cart if any items were filtered out
    if (cart.cartItems.length < originalLength) {
      await cart.save();
    }

    // Return cart with availability information
    return res.status(200).json({
      ...cart.toObject(),
      cartItems: cartItemsWithAvailability
    });
  } catch (error) {
    console.error("Error getting cart:", error);
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

    // Release inventory reservation for this product
    await releaseReservation(userId, productId);

    // Filter out the item to remove
    cart.cartItems = cart.cartItems.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    // Return the updated cart with populated product data
    const updatedCart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      select: "title price images countInStock",
    });

    // Add availability information to each cart item
    const cartItemsWithAvailability = await Promise.all(
      updatedCart.cartItems.map(async (item) => {
        if (!item.product) return item;

        // Get available quantity for this product
        const availableQuantity = await getAvailableQuantity(item.product._id);

        // Add availability information to the item
        return {
          ...item.toObject(),
          availableQuantity,
          inStock: availableQuantity > 0,
          hasEnoughStock: availableQuantity >= item.quantity
        };
      })
    );

    // Return cart with availability information
    return res.status(200).json({
      ...updatedCart.toObject(),
      cartItems: cartItemsWithAvailability
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
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

    // Process each cart item update
    for (const { product, quantity } of cartItems) {
      const item = cart.cartItems.find(
        item => item.product.toString() === product
      );

      if (item) {
        // If quantity is increasing, check inventory
        if (quantity > item.quantity) {
          const additionalQuantity = quantity - item.quantity;

          // Check if product has enough inventory
          const isAvailable = await checkInventoryAvailability(product, additionalQuantity);
          if (!isAvailable) {
            const availableQty = await getAvailableQuantity(product);
            const productObj = await Product.findById(product);

            return res.status(400).json({
              error: "Not enough inventory available",
              productId: product,
              productTitle: productObj ? productObj.title : 'Unknown Product',
              requestedQuantity: quantity,
              availableQuantity: availableQty + item.quantity // Include current cart quantity
            });
          }

          // Reserve additional inventory
          await reserveInventory(userId, product, additionalQuantity);
        }
        // If quantity is decreasing, release inventory
        else if (quantity < item.quantity) {
          // We don't need to explicitly release here as we'll just let the reservation expire
          // The reservation system will handle this automatically
        }

        // Update the quantity
        item.quantity = quantity;
      }
    }

    await cart.save();

    // Return the updated cart with populated product data
    const updatedCart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      select: "title price images countInStock",
    });

    // Add availability information to each cart item
    const cartItemsWithAvailability = await Promise.all(
      updatedCart.cartItems.map(async (item) => {
        if (!item.product) return item;

        // Get available quantity for this product
        const availableQuantity = await getAvailableQuantity(item.product._id);

        // Add availability information to the item
        return {
          ...item.toObject(),
          availableQuantity,
          inStock: availableQuantity > 0,
          hasEnoughStock: availableQuantity >= item.quantity
        };
      })
    );

    // Return cart with availability information
    return res.status(200).json({
      ...updatedCart.toObject(),
      cartItems: cartItemsWithAvailability
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: error.message });
  }
};
