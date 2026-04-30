import User from "../models/user.model.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required." });
    }

    const user = await User.findById(userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "FORBIDDEN", message: "Admin access required." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "SERVER_ERROR", message: "Failed to verify admin access." });
  }
};
