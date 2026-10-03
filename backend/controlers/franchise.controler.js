import Franchises from "../models/franchise.model.js";
import bcrypt from "bcrypt";
import createTokenAndSaveCookiesForFranchise from "../jwt/franchiseAuthToken.js";
import jwt from "jsonwebtoken";

export const franchise_register = async (req, res) => {
  try {
    // 1. Destructure the flat payload provided by the updated Zod schema
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
    } = req.body;

    // 2. Query data using the nested schema paths
    const existingEmail = await Franchises.findOne({
      "owner.email": email.toLowerCase(),
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "This email is already registered." });
    }

    const existingPhone = await Franchises.findOne({ "owner.phone": phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "This phone number is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Construct the document to match your Mongoose nesting requirements exactly
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
          coordinates: [longitude, latitude], // Mongo expects [longitude, latitude]
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
      // status defaults automatically to 'Applied' via the Mongoose schema design
    });

    // 4. Save to MongoDB
    await newFranchise.save();

    // 5. Generate Cookie tokens
    try {
      const franchiseToken = await createTokenAndSaveCookiesForFranchise(
        newFranchise._id,
        email,
        res,
      );

      // Convert to clean JSON and strip password security string out
      const franchiseResponse = newFranchise.toObject();
      delete franchiseResponse.password;

      return res.status(201).json({
        message: "Franchise registered successfully",
        franchise: franchiseResponse,
        franchiseToken,
      });
    } catch (tokenError) {
      console.error("Token generation error context:", tokenError);
      return res
        .status(500)
        .json({ error: "Franchise saved, but token configuration failed." });
    }
  } catch (error) {
    console.error("Error during registration process:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const franchise_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill the required field" }); // asking for fill required field
    }

    const franchise = await Franchises.findOne({ email }).select("+password"); // find the email from database

    if (!franchise) {
      return res
        .status(400)
        .json({ message: "Your are not registered with this email" });
    }

    const isMatchPassword = await bcrypt.compare(password, franchise.password);

    if (!isMatchPassword) {
      return res
        .status(400)
        .json({
          message: "Your Password is wrong! Pleasse enter valid passwrod.",
        });
    }

    const franchiseLoginToken = await createTokenAndSaveCookiesForFranchise(
      franchise._id,
      email,
      res,
    );
    res.status(200).json({
      message: "Your are loggedin successfully.",
      token: franchiseLoginToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal serve Error. Please try again" });
  }
};

export const franchise_logout = async (req, res) => {
  try {
    // Extract the token from the cookie
    const franchiseToken = req.cookies.jwt;

    if (!franchiseToken) {
      return res
        .status(400)
        .json({ message: "No user is currently logged in." });
    }

    // Decode the token to get user information
    const decoded = jwt.verify(franchiseToken, process.env.JWT_SECRET_KEY);

    // Clear the JWT cookie
    res.clearCookie("jwt");

    // response with success message
    return res.status(200).json({
      message: `User with email ${decoded.email} has logged out successfully.`,
    });
  } catch (error) {
    console.log(error);

    // Handle JWT verification errors or other unexpected issues
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFranchiseByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const franchises = await Franchises.find({ status });
    return res.status(200).json({
      message: "All franchises by status are retrive successfully.",
      data: franchises,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error. " });
  }
};

export const getAll_Franchise = async (req, res) => {
  try {
    // retrive all franchises from the database
    const franchises = await Franchises.find();

    // now return the list of franchises
    return res.status(200).json({
      message: "All franchies are retrive successfully.",
      data: franchises,
    });
  } catch (error) {
    console.error("Error retrieving franchises", error);
    return res.status(500).json({ message: "Internal server error. " });
  }
};

export const franchiseStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const franchise = await Franchises.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return res.status(200).json({
      message: "Franchise status updated successfully.",
      data: franchise,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error. " });
  }
};
