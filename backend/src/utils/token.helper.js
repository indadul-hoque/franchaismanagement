import jwt from "jsonwebtoken";
import env from "../config/env.js";
import Franchises from "../models/franchise.model.js";

export const getCookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: env.IS_PRODUCTION,
  sameSite: env.IS_PRODUCTION ? "none" : "lax",
  maxAge: maxAgeMs,
});

export const generateAccessTokenAndSaveCookies = (userId, res) => {
  const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });

  if (res && typeof res.cookie === "function") {
    res.cookie("accessToken", accessToken, getCookieOptions(60 * 60 * 1000));
  }

  return accessToken;
};

export const generateRefreshTokenAndSaveCookies = (userId, res) => {
  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  if (res && typeof res.cookie === "function") {
    res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
  }

  return refreshToken;
};

export const createTokenAndSaveCookiesForFranchise = async (franchiseId, email, res) => {
  try {
    const franchiseToken = jwt.sign({ franchiseId, email }, env.JWT_FRANCHISE_SECRET, {
      expiresIn: "1h",
    });

    if (res && typeof res.cookie === "function") {
      res.cookie("jwt", franchiseToken, {
        httpOnly: false,
        secure: env.IS_PRODUCTION,
        sameSite: env.IS_PRODUCTION ? "none" : "lax",
      });
    }

    if (franchiseId) {
      await Franchises.findByIdAndUpdate(franchiseId, { token: franchiseToken });
    }

    return franchiseToken;
  } catch (error) {
    console.error("[TokenHelper] Error creating franchise token:", error);
    throw error;
  }
};

export default {
  generateAccessTokenAndSaveCookies,
  generateRefreshTokenAndSaveCookies,
  createTokenAndSaveCookiesForFranchise,
};

