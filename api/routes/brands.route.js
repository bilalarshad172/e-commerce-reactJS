import express from "express";
import {
  brands,
  getBrands,
  updateBrand,
  deleteBrand,
  getBrandById,
} from "../controllers/brands.controller.js";

const router = express.Router();

router.post("/brands", brands);
router.get("/brands", getBrands);
router.get("/brands/:id", getBrandById);
router.put("/brands/:id", updateBrand);
router.delete("/brands/:id", deleteBrand);

export default router;
