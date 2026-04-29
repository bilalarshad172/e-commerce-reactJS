import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required." });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token." });
  }
};
