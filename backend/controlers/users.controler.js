import Users from "../models/users.model.js";
import bcrypt from "bcrypt";
import {
  generateAccessTokenAndSaveCookies,
  generateRefreshTokenAndSaveCookies,
} from "../jwt/authToken.js";

// ============================ REGISTER ============================
export const register = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    const role = "guest";
    // Validate input fields
    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }
    // Check if phone or email already exists
    const existingUser = await Users.findOne({
      $or: [{ phone }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Phone or Email already registered" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Users({
      // Check if this should be 'Users' instead
      firstName,
      lastName,
      role,
      phone,
      email,
      password: hashPassword,
    });

    // Save user to database
    await newUser.save();

    // Respond to user
    return res.status(201).json({
      success: true,
      message: "Account creation successful. Please login",
      users: newUser,
    });
  } catch (error) {
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

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Ensure password is selected (since select: false is set in the schema)
    const user = await Users.findOne({ email }).select("+password");

    //check user if exists or not
    if (!user) {
      return res
        .status(400)
        .json({ message: "You are not registered with this email." });
    }

    // check user is active or not
    if (!user.isActive) {
      return res.status(400).json({ message: "Your account is inactive." });
    }

    // check user role
    if (user.role !== role) {
      return res.status(400).json({
        message: "Your role does not match. Please select valid role!",
      });
    }

    // compare password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate token & set cookie
    await generateAccessTokenAndSaveCookies(user._id, res);
    const refreshToken = await generateRefreshTokenAndSaveCookies(
      user._id,
      res,
    );

    // hash refresh token
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashRefreshToken;
    await user.save();

    //send response data
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      role: user.role,
    };

    res.status(200).json({ message: "User logged in successfully." });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ============================ LOGOUT ============================
export const logout = async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================ GET LOGGED IN USER ============================
export const getProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      role: user.role,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching logged in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ============================ DELETE USERS ============================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const deletedUser = await Users.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ============================ ALL USERS ============================
export const allUsers = async (req, res) => {
  try {
    const users = await Users.find();
    const totalUsers = users.length;

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

// Generate new access token if access token is expired
export const generateNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // check refresh token is exists or not
    if (!refreshToken) {
      return res.status(400).json({ message: "Please login to continue..." });
    }

    // Decode token
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    );

    // Check if the token is issued by our server
    const user = await Users.findById(
      decodedToken.userId,
      "refreshToken",
    ).select("+refreshToken");

    // check user is exists or not
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid refresh token. Please login again." });
    }

    // validate refresh token
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid refresh token.",
      });
    }

    // generate new access token
    await generateAccessTokenAndSaveCookies(user._id, res);

    return res
      .status(200)
      .json({ message: "New access token generated successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Refresh token expired.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
