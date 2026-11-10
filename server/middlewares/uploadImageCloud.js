const CustomError = require("../utils/customError");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { cloudinaryUpload } = require("../utils/cloudinary");

const uploadImage = asyncHandler(async (req, _res, next) => {
  if (!req.file) {
    throw new CustomError("No file provided", 400);
  }

  const imagePath = path.join(__dirname, `../upload/${req.file.filename}`);

  try {
    const isUploaded = await cloudinaryUpload(imagePath);

    if (!isUploaded?.publicId || !isUploaded?.url) {
      throw new CustomError("File not uploaded", 500);
    }

    req.fileUploadedInfo = isUploaded;
    next();
  } finally {
    await fs.promises.unlink(imagePath).catch(() => {});
  }
});

module.exports = uploadImage;
