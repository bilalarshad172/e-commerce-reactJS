import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,   
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
categorySchema.index({ title: 1, parent: 1 }, { unique: true });
const Category = mongoose.model("Category", categorySchema);

export default Category;
