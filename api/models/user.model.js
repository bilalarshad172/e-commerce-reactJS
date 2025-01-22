import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      fullPhoneNumber: {
        type: String,
        required: true, // Ensure the phone number is mandatory
      },
      isoCode: {
        type: String, // Ensure the ISO code is mandatory
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
