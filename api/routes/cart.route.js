import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { getCart, addToCart, removeFromCart, updateCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/cart",verifyToken, getCart);
router.post("/cart", addToCart);
router.put("/cart", updateCart);
router.delete("/cart", removeFromCart);

export default router;
