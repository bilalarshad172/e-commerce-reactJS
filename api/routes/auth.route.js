import express from "express";
import { signup, login, getAllUsers, googleAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/users", getAllUsers);


export default router;