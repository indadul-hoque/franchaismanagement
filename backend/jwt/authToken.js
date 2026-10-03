import jwt from "jsonwebtoken";

const generateAccessTokenAndSaveCookies = (userId, res) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "1h", // Token expires in 1 hour
    },
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000, // Cookie expires in 1 hour (milliseconds)
  });

  return accessToken;
};

const generateRefreshTokenAndSaveCookies = (userId, res) => {
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d", // Token expires in 7 days
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7 * 1000, // Cookie expires in 7 days (milliseconds)
  });

  return refreshToken;
};
export {
  generateAccessTokenAndSaveCookies,
  generateRefreshTokenAndSaveCookies,
};
