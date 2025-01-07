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
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.listen(3000, () => { 
  console.log("Server is running on port 3000!!");
});
console.log("Serving static files from:", path.join(__dirname, "uploads"));
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });



app.use(express.json());
app.use(cors({
  origin: "http://localhost:5174", // or "*"
  methods: ["GET", "POST"],
}));


//Routes for APIs
app.use("/api/auth", authRoutes);
app.use("/api/", CategoryRoutes);
app.use("/api/", BrandRoutes);
app.use("/api/", ProductRoutes);
app.use("/api/", UploadRoutes);
