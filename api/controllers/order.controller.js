import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { completeReservations } from "../services/inventory.service.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    // Get user ID from token
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Verify inventory availability one last time before creating order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          message: "Product not found",
          productId: item.product
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: "Not enough inventory available",
          productId: item.product,
          productTitle: product.title,
          requestedQuantity: item.quantity,
          availableQuantity: product.countInStock
        });
      }
    }

    // Create the order
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Update inventory and complete reservations
    await completeReservations(userId, orderItems);

    // Clear the user's cart after successful order creation
    await Cart.findOneAndDelete({ user: userId });

    // Populate product details for the response
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate("user", "username email")
      .populate({
        path: "orderItems.product",
        select: "title price images",
      });

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// Get all orders (admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "username email")
      .populate({
        path: "orderItems.product",
        select: "title price images",
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders", error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "username email")
      .populate({
        path: "orderItems.product",
        select: "title price images",
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({ message: "Error retrieving order", error: error.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "orderItems.product",
        select: "title price images",
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      message: "User orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    res.status(500).json({ message: "Error retrieving user orders", error: error.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    // If status is "Delivered", update isDelivered and deliveredAt
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    // If status is "Cancelled", update isPaid to false if it was not already paid
    if (status === "Cancelled" && !order.isPaid) {
      order.isPaid = false;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// Update order to paid
export const updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentResult } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult || {
      id: Date.now().toString(),
      status: "Completed",
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order marked as paid",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order to paid:", error);
    res.status(500).json({ message: "Error updating order to paid", error: error.message });
  }
};
