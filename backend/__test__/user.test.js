import { register } from "../controlers/users.controler.js";
import Users from "../models/users.model.js";
import bcrypt from "bcrypt";

// Mock external dependencies
jest.mock("../models/users.model.js");
jest.mock("bcrypt");

describe("Register Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = { email: "test@example.com" }; // Missing firstName, lastName, phone, password

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  it("should return 400 for invalid email format", async () => {
    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "invalid-email-format",
      password: "Password123",
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email address",
    });
  });

  it("should return 400 for invalid phone number", async () => {
    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "123456", // Invalid phone format according to /^[6-9]\d{9}$/
      email: "john@example.com",
      password: "Password123",
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid phone number",
    });
  });

  it("should return 400 if user or phone already exists", async () => {
    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "existing@example.com",
      password: "Password123",
    };

    Users.findOne.mockResolvedValue({ email: "existing@example.com" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Phone or Email already registered",
    });
  });

  it("should register a new user successfully", async () => {
    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "newuser@example.com",
      password: "Password123",
    };

    Users.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword123");
    Users.prototype.save = jest.fn().mockResolvedValue(true);

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("Password123", 10);
    expect(Users.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Account creation successful. Please login",
      }),
    );
  });

  it("should return 500 when database save fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "error@example.com",
      password: "Password123",
    };

    Users.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword123");
    Users.prototype.save = jest
      .fn()
      .mockRejectedValue(new Error("Database Failure"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });

    consoleSpy.mockRestore();
  });
});
