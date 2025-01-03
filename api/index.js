import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import CategoryRoutes from "./routes/category.route.js";
import BrandRoutes from "./routes/brands.route.js";
import ProductRoutes from "./routes/product.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => { 
  console.log("Server is running on port 3000!!");
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/", CategoryRoutes);
app.use("/api/", BrandRoutes);
app.use("/api/", ProductRoutes);
