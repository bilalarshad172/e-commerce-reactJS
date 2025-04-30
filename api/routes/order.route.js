import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updateOrderToPaid,
} from "../controllers/order.controller.js";

const router = express.Router();

// Create a new order (requires authentication)
router.post("/orders", verifyToken, createOrder);

// Get all orders (admin)
router.get("/orders", verifyToken, getOrders);

// Get order by ID
router.get("/orders/:id", verifyToken, getOrderById);

// Get user's orders
router.get("/orders/user/myorders", verifyToken, getUserOrders);

// Update order status (admin)
router.put("/orders/:id/status", verifyToken, updateOrderStatus);

// Update order to paid
router.put("/orders/:id/pay", verifyToken, updateOrderToPaid);

export default router;
