import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { products, getProduct, deleteProduct, getProductById, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/products", products);
router.get("/products",verifyToken, getProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);


export default router;