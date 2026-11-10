const CustomError = require("../utils/customError.js");

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error?.isJoi || error?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: error?.isJoi ? "Validation failed" : "Bad Request",
      type: "ValidationError",
      details: error?.isJoi
        ? error.details?.map((detail) => detail.message)
        : undefined,
    });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Invalid resource id",
    });
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Invalid JSON body",
    });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      status: 413,
      message: "Request body is too large",
    });
  }

  if (error?.name === "MulterError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Uploaded file is too large"
          : "Invalid file upload",
    });
  }

  if (error?.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message,
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      status: 409,
      message: "Resource already exists",
    });
  }

  if (error instanceof CustomError) {
    return res.status(error.statusCode || 500).json({
      success: false,
      status: error.statusCode || 500,
      message: error.message,
    });
  }

  console.error("Unhandled error:", error);
  return res.status(500).json({
    success: false,
    status: 500,
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
