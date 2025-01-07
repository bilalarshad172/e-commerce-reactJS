import express from "express";
import { upload } from "../middleware/upload.js";
import { createProductImages, getProductImages } from "../controllers/upload.controller.js";

const router = express.Router();

// POST route to upload multiple images
// "images" is the form field name used in the frontend
router.post("/upload-images", upload.array("images", 10), createProductImages);

// GET route to retrieve product images (optional, can also be part of product controller)
router.get("/product-images/:id", getProductImages);

export default router;