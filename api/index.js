import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import CategoryRoutes from "./routes/category.route.js";
import BrandRoutes from "./routes/brands.route.js";
import ProductRoutes from "./routes/product.route.js";
import UploadRoutes from "./routes/imageUpload.routes.js";
import Category from "./models/category.model.js";
import CartRoutes from "./routes/cart.route.js";
import OrderRoutes from "./routes/order.route.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cookieParser());
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(
  cors({
    origin: "http://localhost:5174", // or "*"
    methods: ["GET", "POST"],
    credentials: true,
  })
);

//Routes for APIs
app.use("/api/auth", authRoutes);
app.use("/api/", CategoryRoutes);
app.use("/api/", BrandRoutes);
app.use("/api/", ProductRoutes);
app.use('/api', UploadRoutes);
app.use('/api', CartRoutes);
app.use('/api', OrderRoutes);


