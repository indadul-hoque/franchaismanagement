import * as franchiseService from "../services/franchise.service.js";

export const franchise_register = async (req, res) => {
  try {
    const result = await franchiseService.registerFranchise(req.body, res);
    return res.status(201).json({
      message: "Franchise registered successfully",
      franchise: result.franchise,
      franchiseToken: result.franchiseToken,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Error during registration process:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const franchise_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await franchiseService.loginFranchise({ email, password }, res);
    return res.status(200).json({
      message: "Your are loggedin successfully.",
      token: result.token,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ error: "Internal serve Error. Please try again" });
  }
};

export const franchise_logout = async (req, res) => {
  try {
    const franchiseToken = req.cookies?.jwt;
    const decoded = franchiseService.logoutFranchise(franchiseToken, res);
    return res.status(200).json({
      message: `User with email ${decoded.email} has logged out successfully.`,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFranchiseByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const franchises = await franchiseService.getFranchisesByStatus(status);
    return res.status(200).json({
      message: "All franchises by status are retrive successfully.",
      data: franchises,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error. " });
  }
};

export const getAll_Franchise = async (req, res) => {
  try {
    const franchises = await franchiseService.getAllFranchises();
    return res.status(200).json({
      message: "All franchies are retrive successfully.",
      data: franchises,
    });
  } catch (error) {
    console.error("Error retrieving franchises", error);
    return res.status(500).json({ message: "Internal server error. " });
  }
};

export const franchiseStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const franchise = await franchiseService.updateFranchiseStatus(id, status);
    return res.status(200).json({
      message: "Franchise status updated successfully.",
      data: franchise,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error. " });
  }
};

export default {
  franchise_register,
  franchise_login,
  franchise_logout,
  getAllFranchiseByStatus,
  getAll_Franchise,
  franchiseStatusUpdate,
};

