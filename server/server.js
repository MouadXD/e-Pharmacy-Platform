const mongoose = require("mongoose");
const app = require("./app");

const PORT = Number(process.env.PORT) || 8000;

const server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

const closeResources = async (exitCode) => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Failed to close the database connection:", error.message);
  }

  process.exit(exitCode);
};

const shutdown = (signal, exitCode = 0) => {
  console.log(`${signal} received, shutting down`);

  server.close(() => {
    closeResources(exitCode);
  });

  setTimeout(() => process.exit(exitCode || 1), 10000).unref();
};

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  shutdown("uncaughtException", 1);
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = server;
