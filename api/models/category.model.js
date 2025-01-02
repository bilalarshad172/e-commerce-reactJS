import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // To ensure category names are unique
    },
    value: {
      type: String,
      required: true,
      unique: true, // To ensure unique identifiers for each category
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to another category for nested structure
      default: null, // Root categories will have null as parent
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true } // Automatically manages `createdAt` and `updatedAt`
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
