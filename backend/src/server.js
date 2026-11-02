import app from "./app.js";
import connectDatabase from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDatabase();
    console.log("[Database] MongoDB Connected");

    const server = app.listen(env.PORT, () => {
      console.log(
        `[Server] Running on port ${env.PORT} in ${env.NODE_ENV} mode`
      );
    });

    // Graceful shutdown handler
    const shutdown = async (signal) => {
      console.log(`[Server] ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        try {
          const { disconnectDatabase } = await import("./config/db.js");
          await disconnectDatabase();
          console.log("[Database] Disconnected.");
        } catch (err) {
          console.error("[Database] Error during disconnect:", err);
        }
        process.exit(0);
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        console.error(
          "[Server] Graceful shutdown timed out. Forcing process exit."
        );
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason, promise) => {
      console.error("[Server] Unhandled Rejection at:", promise, "reason:", reason);
      shutdown("unhandledRejection");
    });

    process.on("uncaughtException", (err) => {
      console.error("[Server] Uncaught Exception:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("[Server] Startup failure:", error);
    process.exit(1);
  }
};

startServer();

