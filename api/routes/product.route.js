import express from "express";
import { products, getProduct, deleteProduct, getProductById, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/products", products);
router.get("/products", getProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);


export default router;