import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import CategoryRoutes from "./routes/category.route.js";
import BrandRoutes from "./routes/brands.route.js";
import ProductRoutes from "./routes/product.route.js";
import UploadRoutes from "./routes/imageUpload.routes.js";
import Category from "./models/category.model.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});
mongoose
  .connect(process.env.MONGO)
  .then(async () => {
    console.log("Database connected");

    // Sync the indexes
    await Category.syncIndexes();
    console.log("Indexes synced successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174", // or "*"
    methods: ["GET", "POST"],
  })
);

//Routes for APIs
app.use("/api/auth", authRoutes);
app.use("/api/", CategoryRoutes);
app.use("/api/", BrandRoutes);
app.use("/api/", ProductRoutes);
app.use("/api/", UploadRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ message, statusCode, success: false });
});
