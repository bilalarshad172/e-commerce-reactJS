import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { products, getProduct, deleteProduct, getProductById, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/products", verifyToken, products);
router.get("/products", getProduct);
router.delete("/products/:id", verifyToken, deleteProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", verifyToken, updateProduct);


export default router;
