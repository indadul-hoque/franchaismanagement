import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors?.length ? { errors: error.errors } : {}),
    ...(env.IS_PRODUCTION ? {} : { stack: error.stack }),
  };

  if (!env.IS_PRODUCTION && error.statusCode >= 500) {
    console.error("[ServerError]", err);
  }

  return res.status(error.statusCode).json(response);
};

export default {
  notFoundHandler,
  errorHandler,
};

