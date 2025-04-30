import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { getCart, addToCart, removeFromCart, updateCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/cart", verifyToken, getCart);
router.post("/cart", addToCart); // Keep this as is since it doesn't require auth
router.put("/cart", verifyToken, updateCart);
router.delete("/cart", verifyToken, removeFromCart);

export default router;
