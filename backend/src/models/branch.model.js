import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema(
  {
    // 1. The Parent Link (Mandatory)
    franchiseId: {
      type: Schema.Types.ObjectId,
      ref: "FranchiseRegistration",
      required: [true, "A branch must be linked to a parent franchise"],
      index: true,
    },

    // 2. Core Operational Details
    branchName: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Under Construction", "Closed"],
      default: "Under Construction",
      required: true,
      index: true,
    },

    // 3. Independent Contact Info
    contact: {
      email: { type: String, lowercase: true, trim: true },
      phone: { type: String, trim: true },
      managerName: { type: String, trim: true }, // Who runs this specific site?
    },

    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modules",
      },
    ],

    // 4. Structural Address & Geospatial Mapping
    location: {
      addressLine: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
      },
    },
  },
  {
    timestamps: true,
  },
);

// Allows fast searching for local branches via distance calculations
branchSchema.index({ "location.coordinates": "2dsphere" });

const BranchModel = mongoose.model("Branch", branchSchema);
export default BranchModel;
