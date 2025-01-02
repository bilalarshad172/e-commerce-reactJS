import express from "express";
import { brands, getBrands } from "../controllers/brands.controller.js";

const router = express.Router();

router.post("/brands", brands);
router.get("/brands", getBrands);

export default router;