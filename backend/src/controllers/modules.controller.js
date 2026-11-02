import * as moduleService from "../services/module.service.js";

export const createModules = async (req, res) => {
  try {
    const updatedConfig = await moduleService.setModulePermissions(req.body);
    return res.status(201).json({
      message: "Module created successfully",
      data: updatedConfig,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getModulePermission = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const modulePermission = await moduleService.getModulePermissions(targetType, targetId);
    return res.status(200).json({
      message: "Module permission fetched successfully",
      data: modulePermission,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createModules,
  getModulePermission,
};

