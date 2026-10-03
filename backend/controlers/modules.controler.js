import Modules from "../models/modules.model.js";
import Franchises from "../models/franchise.model.js";
import Branches from "../models/branch.model.js";

export const createModules = async (req, res) => {
  try {
    const { targetType, franchiseId, branchId, modules } = req.body;

    // 1. Validation
    if (!targetType || !["franchise", "branch"].includes(targetType)) {
      return res.status(400).json({
        message: "Invalid target type. Must be 'franchise' or 'branch'.",
      });
    }
    if (targetType === "franchise" && !franchiseId) {
      return res.status(400).json({ message: "Franchise ID is required" });
    }
    if (targetType === "branch" && !branchId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }
    if (!Array.isArray(modules) || modules.length === 0) {
      return res
        .status(400)
        .json({ message: "Modules array cannot be empty." });
    }

    // now check that franchiseId or branchId
    let parentDoc = null;
    if (targetType === "franchise") {
      parentDoc = await Franchises.findById(franchiseId);
      if (!parentDoc)
        return res.status(404).json({ message: "Franchise not found" });
    } else {
      parentDoc = await Branches.findById(branchId);
      if (!parentDoc)
        return res.status(404).json({ message: "Branch not found" });
    }

    // 3. Generate Target ID and Path Slug
    const targetId = (
      targetType === "franchise" ? franchiseId : branchId
    ).toString();

    // 3. Format and Sanitize Modules Array
    const sanitizedModules = modules.map((mod) => {
      // Auto-generate path if client didn't pass one
      const slug = mod.moduleName
        ? mod.moduleName
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, "-")
        : "";

      const defaultPath =
        targetType === "franchise"
          ? `/franchise/${slug}`
          : `/franchise/branch/${slug}`;

      return {
        path: mod.path || defaultPath,
        moduleName: mod.moduleName || mod.label || "Unnamed Module",
        enabled: Boolean(mod.enabled),
        icon: mod.icon || "",
        color: mod.color || "#0d6efd",
      };
    });

    // 4. Save/Update Entire Permission Set for this Target
    const updatedConfig = await Modules.findOneAndUpdate(
      { targetId },
      {
        $set: {
          targetId,
          targetType,
          franchiseId: targetType === "franchise" ? franchiseId : null,
          branchId: targetType === "branch" ? branchId : null,
          modules: sanitizedModules, // Replaces entire module configuration set
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    // 5. Connect reference to Franchise/Branch if not attached yet
    if (!parentDoc.modules.includes(updatedConfig._id)) {
      parentDoc.modules.push(updatedConfig._id);
      await parentDoc.save();
    }

    // send response
    return res.status(201).json({
      message: "Module created successfully",
      data: updatedConfig,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getModulePermission = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    if (!targetType || !["franchise", "branch"].includes(targetType)) {
      return res.status(400).json({
        message: "Invalid target type. Must be 'franchise' or 'branch'.",
      });
    }
    if (!targetId) {
      return res.status(400).json({ message: "Target ID is required" });
    }
    const modulePermission = await Modules.findOne({
      targetType,
      targetId,
    });
    if (!modulePermission) {
      return res.status(404).json({ message: "Module permission not found" });
    }
    return res.status(200).json({
      message: "Module permission fetched successfully",
      data: modulePermission,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
