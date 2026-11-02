import { ZodError } from "zod";

export const validateInput = (validator) => async (req, res, next) => {
  try {
    const parsed = await validator.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.body = parsed.body;
    req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    return next();
  } catch (error) {
    const rawIssues =
      error instanceof ZodError ? error.issues : error?.issues || error?.errors;

    if (Array.isArray(rawIssues)) {
      const errorMessages = rawIssues.map((err) => ({
        field:
          err.path.length > 1
            ? err.path.slice(1).join(".")
            : err.path[0] || "field",
        message: err.message,
      }));

      return res.status(400).json({
        status: "Fail",
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    console.error("[ValidationMiddleware] Unexpected System Error:", error);
    return res.status(500).json({
      status: "Error",
      success: false,
      message: "An internal server error occurred during data validation processing.",
    });
  }
};

export default validateInput;

