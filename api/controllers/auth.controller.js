import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup controller

export const signup = async (req, res, next) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("access_token", token, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production", // recommended in production
        sameSite: "strict", // or "none" if you're dealing with cross-site cookies
      })
      .status(201)
      .json({ message: "User created successfully!" });
  } catch (error) {
    next(error); // Pass the error to error-handling middleware
  }
};



export const googleAuth = async (req, res) => {
  const { username, email, photoURL, googleId } = req.body;
  try {
    // 1. Check if user already exists
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    // 2. If user exists, just proceed (login)
    if (user) {
      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set cookie
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
          // secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ message: "Login successful via Google!", userId: user._id });
    }

    // 3. If user does not exist, create a new one
    const newUser = new User({
      username,
      email,
      photoURL,
      googleId,
    });
    await newUser.save();

    // 4. Generate JWT for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Set the cookie and respond
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        // secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({ message: "User created successfully via Google!", userId: newUser._id });
  } catch (error) {
    console.error("Error in googleAuth:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Login successful
    res
      .cookie("access_token", token, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Login successful!" });
  } catch (error) {
    next(error); // Pass the error to error-handling middleware
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userID = req.user.id; // from the token payload
    const user = await User.findById(userID, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get user profile" });
  }
};
