import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { getAdminDashboardSummary } from "../controllers/adminDashboard.controller.js";

const router = express.Router();

router.get("/dashboard/summary", verifyToken, verifyAdmin, getAdminDashboardSummary);

export default router;
