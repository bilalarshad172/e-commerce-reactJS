import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/wishlist", verifyToken, getWishlist);
router.post("/wishlist", verifyToken, addToWishlist);
router.delete("/wishlist", verifyToken, removeFromWishlist);

export default router;
