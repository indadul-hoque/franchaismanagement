import mongoose from "mongoose";

const FranchiseRegistrationSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      index: true,
    },

    // --- Owner / Franchisee Contact Info ---
    owner: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      phone: { type: String, required: true, trim: true },
      taxId: { type: String, required: true },
    },

    // --- Business Details & Legal Entity ---
    businessDetails: {
      legalName: { type: String, required: true, trim: true },
      tradeName: { type: String, required: true, trim: true },
      incorporationType: {
        type: String,
        enum: [
          "LLC",
          "Corporation",
          "Partnership",
          "Sole Proprietorship",
          "Other",
        ],
        required: true,
      },
    },

    // --- Location & Geographic Mapping ---
    location: {
      addressLine1: { type: String, required: true, trim: true },
      addressLine2: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, default: "US" },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
      },
    },

    // --- Franchise Agreement & Contract Details ---
    agreement: {
      signedDate: { type: Date, required: true },
      expiryDate: { type: Date, required: true },
      initialFeePaid: { type: Number, required: true, min: 0 },
      royaltyPercentage: { type: Number, required: true, min: 0, max: 100 },
      marketingFeePercentage: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100,
      },
      contractDocumentUrl: { type: String },
    },

    // --- Lifecycle & Operations Status ---
    status: {
      type: String,
      enum: [
        "Applied",
        "Pending",
        "Approved",
        "Under Construction",
        "Active",
        "Suspended",
        "Terminated",
      ],
      default: "Applied",
      required: true,
      index: true,
    },

    // --- Compliance Logs ---
    compliance: {
      isBackgroundCheckPassed: { type: Boolean, default: false },
      insuranceExpiryDate: { type: Date },
      lastInspectionDate: { type: Date },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modules",
      },
    ],
  },

  {
    timestamps: true,
    // This includes virtuals (like the string version of _id) when converting data to JSON or Objects
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- Geospatial Index ---
FranchiseRegistrationSchema.index({ "location.coordinates": "2dsphere" });

// --- Compound Index for Filtering ---
FranchiseRegistrationSchema.index({ corporateBrand: 1, status: 1 });

const Franchises = mongoose.model(
  "FranchiseRegistration",
  FranchiseRegistrationSchema,
);

export default Franchises;
