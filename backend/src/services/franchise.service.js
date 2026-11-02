import Franchises from "../models/franchise.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { createTokenAndSaveCookiesForFranchise } from "../utils/token.helper.js";

export const registerFranchise = async (data, res) => {
  const {
    brandName,
    firstName,
    lastName,
    email,
    phone,
    taxId,
    legalName,
    tradeName,
    incorporationType,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    longitude,
    latitude,
    signedDate,
    expiryDate,
    initialFeePaid,
    royaltyPercentage,
    marketingFeePercentage,
    contractDocumentUrl,
    password,
    notes,
  } = data;

  const existingEmail = await Franchises.findOne({
    "owner.email": email.toLowerCase(),
  });
  if (existingEmail) {
    throw new ApiError(400, "This email is already registered.");
  }

  const existingPhone = await Franchises.findOne({ "owner.phone": phone });
  if (existingPhone) {
    throw new ApiError(400, "This phone number is already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newFranchise = new Franchises({
    brandName,
    owner: {
      firstName,
      lastName,
      email,
      phone,
      taxId,
    },
    businessDetails: {
      legalName,
      tradeName,
      incorporationType,
    },
    location: {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      coordinates: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    },
    agreement: {
      signedDate,
      expiryDate,
      initialFeePaid,
      royaltyPercentage,
      marketingFeePercentage,
      contractDocumentUrl,
    },
    password: hashedPassword,
    notes,
  });

  await newFranchise.save();

  const franchiseToken = await createTokenAndSaveCookiesForFranchise(
    newFranchise._id,
    email,
    res
  );

  const franchiseResponse = newFranchise.toObject();
  delete franchiseResponse.password;

  return {
    franchise: franchiseResponse,
    franchiseToken,
  };
};

export const loginFranchise = async ({ email, password }, res) => {
  if (!email || !password) {
    throw new ApiError(400, "Please fill the required field");
  }

  const franchise = await Franchises.findOne({ email }).select("+password");
  if (!franchise) {
    throw new ApiError(400, "Your are not registered with this email");
  }

  const isMatchPassword = await bcrypt.compare(password, franchise.password);
  if (!isMatchPassword) {
    throw new ApiError(400, "Your Password is wrong! Pleasse enter valid passwrod.");
  }

  const token = await createTokenAndSaveCookiesForFranchise(franchise._id, email, res);
  return { token };
};

export const logoutFranchise = (token, res) => {
  if (!token) {
    throw new ApiError(400, "No user is currently logged in.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_FRANCHISE_SECRET);
  } catch (err) {
    throw new ApiError(400, "Invalid or expired token.");
  }

  if (res && typeof res.clearCookie === "function") {
    res.clearCookie("jwt");
  }

  return decoded;
};

export const getFranchisesByStatus = async (status) => {
  return await Franchises.find({ status });
};

export const getAllFranchises = async () => {
  return await Franchises.find();
};

export const updateFranchiseStatus = async (id, status) => {
  return await Franchises.findByIdAndUpdate(id, { status }, { new: true });
};

export default {
  registerFranchise,
  loginFranchise,
  logoutFranchise,
  getFranchisesByStatus,
  getAllFranchises,
  updateFranchiseStatus,
};

