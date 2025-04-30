import Product from "../models/product.model.js";
import InventoryReservation from "../models/inventoryReservation.model.js";

/**
 * Check if a product has enough available inventory
 * @param {string} productId - The product ID
 * @param {number} requestedQuantity - The quantity requested
 * @returns {Promise<boolean>} - True if enough inventory is available
 */
export const checkInventoryAvailability = async (productId, requestedQuantity) => {
  try {
    // Get the product
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Get active reservations for this product
    const activeReservations = await InventoryReservation.find({
      product: productId,
      status: "active",
    });

    // Calculate total reserved quantity
    const reservedQuantity = activeReservations.reduce(
      (total, reservation) => total + reservation.quantity,
      0
    );

    // Calculate available quantity
    const availableQuantity = product.countInStock - reservedQuantity;

    // Check if enough inventory is available
    return availableQuantity >= requestedQuantity;
  } catch (error) {
    console.error("Error checking inventory availability:", error);
    throw error;
  }
};

/**
 * Get available quantity for a product
 * @param {string} productId - The product ID
 * @returns {Promise<number>} - Available quantity
 */
export const getAvailableQuantity = async (productId) => {
  try {
    // Get the product
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Get active reservations for this product
    const activeReservations = await InventoryReservation.find({
      product: productId,
      status: "active",
    });

    // Calculate total reserved quantity
    const reservedQuantity = activeReservations.reduce(
      (total, reservation) => total + reservation.quantity,
      0
    );

    // Calculate available quantity
    return Math.max(0, product.countInStock - reservedQuantity);
  } catch (error) {
    console.error("Error getting available quantity:", error);
    throw error;
  }
};

/**
 * Reserve inventory for a product
 * @param {string} userId - The user ID
 * @param {string} productId - The product ID
 * @param {number} quantity - The quantity to reserve
 * @returns {Promise<Object>} - The reservation object
 */
export const reserveInventory = async (userId, productId, quantity) => {
  try {
    // Check if enough inventory is available
    const isAvailable = await checkInventoryAvailability(productId, quantity);
    if (!isAvailable) {
      throw new Error("Not enough inventory available");
    }

    // Create a new reservation
    const reservation = new InventoryReservation({
      user: userId,
      product: productId,
      quantity,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });

    await reservation.save();
    return reservation;
  } catch (error) {
    console.error("Error reserving inventory:", error);
    throw error;
  }
};

/**
 * Complete a reservation (convert from temporary to permanent)
 * @param {string} userId - The user ID
 * @param {Array} items - Array of {productId, quantity} objects
 * @returns {Promise<void>}
 */
export const completeReservations = async (userId, items) => {
  try {
    for (const item of items) {
      // Find active reservations for this user and product
      const reservations = await InventoryReservation.find({
        user: userId,
        product: item.product,
        status: "active",
      });

      // Update product inventory
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.quantity);
        await product.save();
      }

      // Mark reservations as completed
      for (const reservation of reservations) {
        reservation.status = "completed";
        await reservation.save();
      }
    }
  } catch (error) {
    console.error("Error completing reservations:", error);
    throw error;
  }
};

/**
 * Release a reservation (when cart item is removed or expires)
 * @param {string} userId - The user ID
 * @param {string} productId - The product ID
 * @returns {Promise<void>}
 */
export const releaseReservation = async (userId, productId) => {
  try {
    // Find active reservations for this user and product
    const reservations = await InventoryReservation.find({
      user: userId,
      product: productId,
      status: "active",
    });

    // Mark reservations as expired
    for (const reservation of reservations) {
      reservation.status = "expired";
      await reservation.save();
    }
  } catch (error) {
    console.error("Error releasing reservation:", error);
    throw error;
  }
};

/**
 * Clean up expired reservations
 * @returns {Promise<number>} - Number of expired reservations cleaned up
 */
export const cleanupExpiredReservations = async () => {
  try {
    const now = new Date();
    const result = await InventoryReservation.updateMany(
      {
        expiresAt: { $lt: now },
        status: "active",
      },
      {
        $set: { status: "expired" },
      }
    );
    return result.modifiedCount;
  } catch (error) {
    console.error("Error cleaning up expired reservations:", error);
    throw error;
  }
};
