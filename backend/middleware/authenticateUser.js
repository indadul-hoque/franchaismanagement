import Users from "../models/users.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken; // Get JWT token from cookies

    if (!accessToken) {
      return res.status(401).json({ error: "Access denied. Please log in." });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    );

    const user = await Users.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({
      message: "Access token expired",
    });
  }
};
