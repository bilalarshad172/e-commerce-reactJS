import express from "express";
import { categories, getCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/categories", categories);
router.get("/categories", getCategory);

export default router;