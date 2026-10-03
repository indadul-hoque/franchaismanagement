import mongoose from "mongoose";

const moduleItemSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: [true, "Module path is required"],
      trim: true,
    },
    moduleName: {
      type: String,
      required: [true, "Module name/label is required"],
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: "",
      trim: true,
    },
    color: {
      type: String,
      default: "#0d6efd",
      trim: true,
    },
  },
  { _id: false },
);

const moduleSchema = new mongoose.Schema(
  {
    targetId: {
      type: String,
      default: "all",
      index: true,
    },
    targetType: {
      type: String,
      enum: ["franchise", "branch"],
      default: "franchise",
    },
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FranchiseRegistration",
      index: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    modules: [moduleItemSchema],
  },
  {
    timestamps: true,
  },
);

const Modules = mongoose.model("Modules", moduleSchema);

export default Modules;
