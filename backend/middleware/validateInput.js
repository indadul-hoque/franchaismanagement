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
    // Extract issues directly using Zod's native error instance check, fallback to properties safely
    const rawIssues =
      error instanceof ZodError ? error.issues : error?.issues || error?.errors;

    // If we have a list of validation issues, process them safely without crashing
    if (Array.isArray(rawIssues)) {
      const errorMessages = rawIssues.map((err) => ({
        // Converts array paths like ['body', 'contact', 'email'] into 'contact.email'
        field:
          err.path.length > 1
            ? err.path.slice(1).join(".")
            : err.path[0] || "field",
        message: err.message,
      }));

      return res.status(400).json({
        status: "Fail",
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    // Handles unexpected system bugs (Syntax errors, DB timeout, etc.)
    console.error("Unexpected Non-Validation System Error:", error);
    return res.status(500).json({
      status: "Error",
      message:
        "An internal server error occurred during data validation processing.",
    });
  }
};
