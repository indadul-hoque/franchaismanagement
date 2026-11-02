import Modules from "../models/modules.model.js";
import Franchises from "../models/franchise.model.js";
import Branches from "../models/branch.model.js";
import ApiError from "../utils/ApiError.js";

export const setModulePermissions = async ({ targetType, franchiseId, branchId, modules }) => {
  if (!targetType || !["franchise", "branch"].includes(targetType)) {
    throw new ApiError(400, "Invalid target type. Must be 'franchise' or 'branch'.");
  }
  if (targetType === "franchise" && !franchiseId) {
    throw new ApiError(400, "Franchise ID is required");
  }
  if (targetType === "branch" && !branchId) {
    throw new ApiError(400, "Branch ID is required");
  }
  if (!Array.isArray(modules) || modules.length === 0) {
    throw new ApiError(400, "Modules array cannot be empty.");
  }

  let parentDoc = null;
  if (targetType === "franchise") {
    parentDoc = await Franchises.findById(franchiseId);
    if (!parentDoc) throw new ApiError(404, "Franchise not found");
  } else {
    parentDoc = await Branches.findById(branchId);
    if (!parentDoc) throw new ApiError(404, "Branch not found");
  }

  const targetId = (targetType === "franchise" ? franchiseId : branchId).toString();

  const sanitizedModules = modules.map((mod) => {
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

  const updatedConfig = await Modules.findOneAndUpdate(
    { targetId },
    {
      $set: {
        targetId,
        targetType,
        franchiseId: targetType === "franchise" ? franchiseId : null,
        branchId: targetType === "branch" ? branchId : null,
        modules: sanitizedModules,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );

  if (parentDoc.modules && !parentDoc.modules.includes(updatedConfig._id)) {
    parentDoc.modules.push(updatedConfig._id);
    await parentDoc.save();
  }

  return updatedConfig;
};

export const getModulePermissions = async (targetType, targetId) => {
  if (!targetType || !["franchise", "branch"].includes(targetType)) {
    throw new ApiError(400, "Invalid target type. Must be 'franchise' or 'branch'.");
  }
  if (!targetId) {
    throw new ApiError(400, "Target ID is required");
  }

  const modulePermission = await Modules.findOne({ targetType, targetId });
  if (!modulePermission) {
    throw new ApiError(404, "Module permission not found");
  }

  return modulePermission;
};

export default {
  setModulePermissions,
  getModulePermissions,
};

