import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    next(error); // Pass the error to error-handling middleware
  }
};

export const googleAuth = async (req, res, next) => {
  const { username, email, photoURL, googleId } = req.body; // Ensure googleId is sent from the frontend
  try {
    // Check if the user already exists by email or googleId
    const user = await User.findOne({
      $or: [{ email: email }, { googleId: googleId }],
    }).select("_id email");

    if (user) {
      // User exists, proceed with login
      return res
        .status(200)
        .json({ message: "Login successful!", userId: user._id });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      photoURL,
      googleId,
      // username and password are not required for Google-authenticated users
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully!", userId: newUser._id });
  } catch (error) {
    console.error("Error in googleAuth:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
    // Alternatively, if using a global error handler:
    // next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Login successful
    res.status(200).json({ message: "Login successful!" });
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
