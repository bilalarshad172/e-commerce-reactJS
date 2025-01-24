import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { signup, login, getAllUsers, googleAuth, getUserProfile  } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/users", getAllUsers);
router.get("/users/profile",verifyToken, getUserProfile );


export default router;