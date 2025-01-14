import express from "express";
import { categories, getCategory, updateCategory, deleteCategoryById, getCategoryById } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/categories", categories);
router.get("/categories", getCategory);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategoryById);

export default router;