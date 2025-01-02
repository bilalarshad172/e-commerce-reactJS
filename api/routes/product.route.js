import express from "express";
import { products, getProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/products", products);
router.get("/products", getProduct);

export default router;