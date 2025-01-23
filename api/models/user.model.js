import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: function () {
        return !this.googleId; // Required if not a Google-authenticated user
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      // Conditionally required
      type: String,
      required: function () {
        return !this.googleId; // Required if not a Google-authenticated user
      },
    },
    photoURL: {
      // Optional: Store user's profile photo URL
      type: String,
    },
    googleId: {
      // Identifier for OAuth users
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents without this field
    },
    phone: {
      fullPhoneNumber: {
        type: String,
      },
      isoCode: {
        type: String, // Ensure the ISO code is mandatory if phone is provided
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// Index to ensure unique emails and googleIds
userSchema.index({ email: 1, googleId: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);

export default User;
