import { register } from "../src/controllers/user.controller.js";
import * as userService from "../src/services/user.service.js";
import ApiError from "../src/utils/ApiError.js";

// Mock the service — controller should delegate all DB work to it
jest.mock("../src/services/user.service.js");
jest.mock("../src/utils/ApiError.js", () => {
  return jest.fn().mockImplementation((statusCode, message) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
  });
});

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

  // ── Input validation (controller's own responsibility) ──────────────────────

  it("should return 400 if required fields are missing", async () => {
    req.body = { email: "test@example.com" }; // missing firstName, lastName, phone, password

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
      phone: "123456", // must match /^[6-9]\d{9}$/
      email: "john@example.com",
      password: "Password123",
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid phone number",
    });
  });

  // ── Service delegation (controller calls service, returns its result) ────────

  it("should return 201 when service registers user successfully", async () => {
    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "newuser@example.com",
      password: "Password123",
    };

    const fakeUser = { _id: "abc123", firstName: "John", role: "guest" };
    userService.registerUser.mockResolvedValue(fakeUser);

    await register(req, res);

    expect(userService.registerUser).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "newuser@example.com",
      password: "Password123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Account creation successful. Please login",
        users: fakeUser,
      })
    );
  });

  it("should return 400 if service throws ApiError (e.g. duplicate user)", async () => {
    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "existing@example.com",
      password: "Password123",
    };

    const apiErr = { statusCode: 400, message: "Phone or Email already registered" };
    userService.registerUser.mockRejectedValue(apiErr);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Phone or Email already registered",
    });
  });

  it("should return 500 when service throws an unexpected error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    req.body = {
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      email: "error@example.com",
      password: "Password123",
    };

    userService.registerUser.mockRejectedValue(new Error("Database Failure"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });

    consoleSpy.mockRestore();
  });
});
