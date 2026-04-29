import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  mergeCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/cart", verifyToken, getCart);
router.post("/cart", verifyToken, addToCart);
router.post("/cart/merge", verifyToken, mergeCart);
router.put("/cart", verifyToken, updateCart);
router.delete("/cart", verifyToken, removeFromCart);

export default router;
