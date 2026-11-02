import BranchModel from "../models/branch.model.js";
import FranchiseModel from "../models/franchise.model.js";
import ApiError from "../utils/ApiError.js";

export const createBranch = async ({ franchiseId, branchName, status, contact, location }) => {
  const franchise = await FranchiseModel.findById(franchiseId);
  if (!franchise) {
    throw new ApiError(404, "Franchise not found");
  }

  const branch = new BranchModel({
    franchiseId,
    branchName,
    status,
    contact,
    location,
  });

  await branch.save();
  return branch;
};

export const getAllBranches = async () => {
  return await BranchModel.find().populate("franchiseId", "franchiseName");
};

export const getBranchesByFranchiseId = async (franchiseId) => {
  return await BranchModel.find({ franchiseId }).populate("franchiseId", "franchiseName");
};

export const updateBranchById = async (id, updateData) => {
  const updatedBranch = await BranchModel.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedBranch) {
    throw new ApiError(404, "Branch not found");
  }
  return updatedBranch;
};

export const deleteBranchById = async (id) => {
  const branch = await BranchModel.findByIdAndDelete(id);
  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }
  return branch;
};

export default {
  createBranch,
  getAllBranches,
  getBranchesByFranchiseId,
  updateBranchById,
  deleteBranchById,
};

