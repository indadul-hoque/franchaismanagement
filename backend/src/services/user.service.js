import Users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import {
  generateAccessTokenAndSaveCookies,
  generateRefreshTokenAndSaveCookies,
} from "../utils/token.helper.js";

export const registerUser = async ({
  firstName,
  lastName,
  phone,
  email,
  password,
}) => {
  const existingUser = await Users.findOne({
    $or: [{ phone }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "Phone or Email already registered");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = new Users({
    firstName,
    lastName,
    role: "guest",
    phone,
    email,
    password: hashPassword,
  });

  await newUser.save();
  return newUser;
};

export const loginUser = async ({ email, password, role }, res) => {
  const user = await Users.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "You are not registered with this email.");
  }

  if (!user.isActive) {
    throw new ApiError(400, "Your account is inactive.");
  }

  if (user.role !== role) {
    throw new ApiError(
      400,
      "Your role does not match. Please select valid role!",
    );
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    throw new ApiError(400, "Invalid password.");
  }

  const accessToken = generateAccessTokenAndSaveCookies(user._id, res);
  const refreshToken = generateRefreshTokenAndSaveCookies(user._id, res);

  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashRefreshToken;
  await user.save();

  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (userId, res) => {
  if (userId) {
    await Users.findByIdAndUpdate(userId, { refreshToken: null });
  }
  if (res && typeof res.clearCookie === "function") {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
};

export const getUserProfile = async (userId) => {
  const user = await Users.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return {
    _id: user._id,
    firstName: user.firstName,
    role: user.role,
  };
};

export const getAllUsers = async () => {
  return await Users.find();
};

export const deleteUserById = async (id) => {
  const deletedUser = await Users.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }
  return deletedUser;
};

export const refreshAccessToken = async (refreshToken, res) => {
  if (!refreshToken) {
    throw new ApiError(400, "Please login to continue...");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired.");
    }
    throw new ApiError(401, "Invalid refresh token.");
  }

  const user = await Users.findById(decodedToken.userId).select(
    "+refreshToken",
  );
  if (!user) {
    throw new ApiError(400, "Invalid refresh token. Please login again.");
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isMatch) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const accessToken = generateAccessTokenAndSaveCookies(user._id, res);
  return { accessToken };
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  deleteUserById,
  refreshAccessToken,
};
