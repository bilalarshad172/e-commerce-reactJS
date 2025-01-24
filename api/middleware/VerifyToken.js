import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // The JWT will be in the cookies:
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info (e.g., user ID) to request object
      req.user = decodedUser; 
    //   console.log(req.user);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};