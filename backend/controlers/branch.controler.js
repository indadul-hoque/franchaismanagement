import BranchModel from "../models/branch.model.js";
import FranchiseModel from "../models/franchise.model.js";

export const addBranch = async (req, res) => {
    try {
        const { franchiseId, branchName, status, contact, location } = req.body;

        const franchise = await FranchiseModel.findById(franchiseId);
        if (!franchise) {
            return res.status(404).json({
                success: false,
                message: "Franchise not found"
            });
        }

        const branch = new BranchModel({
            franchiseId,
            branchName,
            status,
            contact,
            location
        });

        await branch.save();
        res.status(201).json({
            success: true,
            message: "Branch added successfully",
            data: branch
        });


    } catch (error) {
        console.error("Error adding branch:", error);
        res.status(500).json({ message: "Server error adding branch" });
    }
};

export const getAllBranches = async (req, res) => {
    try {
        const branches = await BranchModel.find().populate("franchiseId", "franchiseName");
        if (!branches.length) {
            return res.status(404).json({
                success: false,
                message: "No branches found"
            });
        }
        res.status(200).json({
            success: true,
            message: "All branches",
            data: branches
        });
    } catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ message: "Server error fetching branches" });
    }
};

export const getBranchByFranshiseId = async (req, res) => {
    try {
        const branch = await BranchModel.find({franchiseId: req.params.id}).populate("franchiseId", "franchiseName");
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found under this franchise"
            });
        }
        res.status(200).json({
            success: true,
            message: "Branch found",
            data: branch
        });
    } catch (error) {
        console.error("Error fetching branch:", error);
        res.status(500).json({ message: "Server error fetching branch" });
    }
};

export const updateBranch = async (req, res) => {
    try {
        const updatedBranch = await BranchModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: updatedBranch
        });
    } catch (error) {
        console.error("Error updating branch:", error);
        res.status(500).json({ message: "Server error updating branch" });
    }
};

export const deleteBranch = async (req, res) => {
    try {
        const branch = await BranchModel.findByIdAndDelete(req.params.id);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
            data: branch
        });
    } catch (error) {
        console.error("Error deleting branch:", error);
        res.status(500).json({ message: "Server error deleting branch" });
    }
};
