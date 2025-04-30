import mongoose from "mongoose";

const inventoryReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    },
    status: {
      type: String,
      enum: ["active", "completed", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Index to find and delete expired reservations
inventoryReservationSchema.index({ expiresAt: 1 });

// Index for faster lookups by product
inventoryReservationSchema.index({ product: 1, status: 1 });

// Index for faster lookups by user
inventoryReservationSchema.index({ user: 1, status: 1 });

const InventoryReservation = mongoose.model(
  "InventoryReservation",
  inventoryReservationSchema
);

export default InventoryReservation;
