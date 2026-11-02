import mongoose from "mongoose";
import * as userService from "../services/user.service.js";

// ============================ REGISTER ============================
export const register = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const newUser = await userService.registerUser({ firstName, lastName, phone, email, password });

    return res.status(201).json({
      success: true,
      message: "Account creation successful. Please login",
      users: newUser,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ============================ LOGIN ============================
export const login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    await userService.loginUser({ email, password, role }, res);
    return res.status(200).json({ message: "User logged in successfully." });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ============================ LOGOUT ============================
export const logout = async (req, res) => {
  try {
    await userService.logoutUser(req.user?._id, res);
    return res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============================ GET LOGGED IN USER ============================
export const getProfile = async (req, res) => {
  try {
    const userData = await userService.getUserProfile(req.user._id);
    return res.status(200).json(userData);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Error fetching logged in user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ============================ DELETE USERS ============================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    await userService.deleteUserById(id);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ============================ ALL USERS ============================
export const allUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

// ============================ GENERATE NEW ACCESS TOKEN ============================
export const generateNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await userService.refreshAccessToken(refreshToken, res);
    return res
      .status(200)
      .json({ message: "New access token generated successfully." });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  register,
  login,
  logout,
  getProfile,
  deleteUser,
  allUsers,
  generateNewAccessToken,
};

