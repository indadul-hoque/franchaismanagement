import * as branchService from "../services/branch.service.js";

export const addBranch = async (req, res) => {
  try {
    const branch = await branchService.createBranch(req.body);
    return res.status(201).json({
      success: true,
      message: "Branch added successfully",
      data: branch,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Error adding branch:", error);
    return res.status(500).json({ message: "Server error adding branch" });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const branches = await branchService.getAllBranches();
    if (!branches.length) {
      return res.status(404).json({
        success: false,
        message: "No branches found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All branches",
      data: branches,
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return res.status(500).json({ message: "Server error fetching branches" });
  }
};

export const getBranchByFranshiseId = async (req, res) => {
  try {
    const branch = await branchService.getBranchesByFranchiseId(req.params.id);
    if (!branch || !branch.length) {
      return res.status(404).json({
        success: false,
        message: "Branch not found under this franchise",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Branch found",
      data: branch,
    });
  } catch (error) {
    console.error("Error fetching branch:", error);
    return res.status(500).json({ message: "Server error fetching branch" });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const updatedBranch = await branchService.updateBranchById(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Error updating branch:", error);
    return res.status(500).json({ message: "Server error updating branch" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await branchService.deleteBranchById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
      data: branch,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Error deleting branch:", error);
    return res.status(500).json({ message: "Server error deleting branch" });
  }
};

export default {
  addBranch,
  getAllBranches,
  getBranchByFranshiseId,
  updateBranch,
  deleteBranch,
};

