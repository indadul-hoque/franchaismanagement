import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "franchise", "student", "guest"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchises",
      default: null,
      index: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branches",
      default: null,
      index: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

const Users = mongoose.model("users", userSchema);
export default Users;
