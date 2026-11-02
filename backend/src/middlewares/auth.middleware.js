import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    throw new ApiError(401, "Access denied. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await Users.findById(decoded.userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    throw new ApiError(401, "Invalid access token");
  }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Role '${req.user?.role || "unknown"}' is not authorized to access this resource`)
      );
    }
    next();
  };
};

export default {
  isAuthenticated,
  authorizeRoles,
};

