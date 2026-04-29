import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import {
  checkInventoryAvailability,
  reserveInventory,
  releaseReservation,
  getAvailableQuantity,
} from "../services/inventory.service.js";
import { buildPopulatedCartResponse } from "../utils/cartResponse.js";

const validateCartItemsPayload = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return "Cart items are required.";
  }

  for (const item of cartItems) {
    if (!item?.product || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return "Each cart item must include a valid product and quantity.";
    }
  }

  return null;
};

const validateInventoryAndReserve = async (userId, cartItems) => {
  for (const { product, quantity } of cartItems) {
    const productExists = await Product.findById(product);
    if (!productExists) {
      return {
        status: 400,
        body: { error: "Product not found", productId: product },
      };
    }

    const isAvailable = await checkInventoryAvailability(product, quantity);
    if (!isAvailable) {
      const availableQty = await getAvailableQuantity(product);
      return {
        status: 400,
        body: {
          error: "Not enough inventory available",
          productId: product,
          productTitle: productExists.title,
          requestedQuantity: quantity,
          availableQuantity: availableQty,
        },
      };
    }

    await reserveInventory(userId, product, quantity);
  }

  return null;
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { cartItems } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required." });
    }

    const validationError = validateCartItemsPayload(cartItems);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const inventoryError = await validateInventoryAndReserve(userId, cartItems);
    if (inventoryError) {
      return res.status(inventoryError.status).json(inventoryError.body);
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      for (const { product, quantity } of cartItems) {
        const item = cart.cartItems.find(
          (cartItem) => cartItem.product.toString() === product
        );
        if (item) {
          item.quantity += quantity;
        } else {
          cart.cartItems.push({ product, quantity });
        }
      }
      await cart.save();
    } else {
      cart = await Cart.create({ user: userId, cartItems });
    }

    const cartResponse = await buildPopulatedCartResponse(userId);
    return res.status(201).json(cartResponse);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const mergeCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { cartItems } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required." });
    }

    const validationError = validateCartItemsPayload(cartItems);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const inventoryError = await validateInventoryAndReserve(userId, cartItems);
    if (inventoryError) {
      return res.status(inventoryError.status).json(inventoryError.body);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, cartItems: [] });
    }

    for (const { product, quantity } of cartItems) {
      const existingItem = cart.cartItems.find(
        (item) => item.product.toString() === product
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.cartItems.push({ product, quantity });
      }
    }

    await cart.save();
    const cartResponse = await buildPopulatedCartResponse(userId);
    return res.status(200).json({
      message: "Guest cart merged successfully",
      ...cartResponse,
    });
  } catch (error) {
    console.error("Error merging cart:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cartResponse = await buildPopulatedCartResponse(userId);
    return res.status(200).json(cartResponse);
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

    const cartResponse = await buildPopulatedCartResponse(userId);
    return res.status(200).json(cartResponse);
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

    const cartResponse = await buildPopulatedCartResponse(userId);
    return res.status(200).json(cartResponse);
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: error.message });
  }
};
