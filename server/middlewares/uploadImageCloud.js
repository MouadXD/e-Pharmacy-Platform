const CustomError = require("../utils/customError");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { cloudinaryUpload } = require("../utils/cloudinary");

const uploadDirectory = path.resolve(__dirname, "../upload");
const safeUploadFilename = /^[a-zA-Z0-9_-]+\.(jpeg|jpg|png|gif|webp)$/i;

// Multer generates the stored path. Validate that it is still a direct child
// of the upload directory before reading or deleting it.
const getValidatedUploadPath = (file) => {
  const filename = file?.filename;
  const imagePath = file?.path;

  if (
    typeof filename !== "string" ||
    !safeUploadFilename.test(filename) ||
    typeof imagePath !== "string" ||
    !path.isAbsolute(imagePath)
  ) {
    throw new CustomError("Invalid upload filename", 400);
  }

  const relativePath = path.relative(uploadDirectory, imagePath);

  if (
    !relativePath ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath) ||
    path.dirname(imagePath) !== uploadDirectory ||
    path.basename(imagePath) !== filename
  ) {
    throw new CustomError("Invalid upload filename", 400);
  }

  return imagePath;
};

const uploadImage = asyncHandler(async (req, _res, next) => {
  if (!req.file) {
    throw new CustomError("No file provided", 400);
  }

  const imagePath = getValidatedUploadPath(req.file);

  try {
    const isUploaded = await cloudinaryUpload(imagePath);

    if (!isUploaded?.publicId || !isUploaded?.url) {
      throw new CustomError("File not uploaded", 500);
    }

    req.fileUploadedInfo = isUploaded;
  } finally {
    await fs.promises.unlink(imagePath).catch(() => {});
  }

  next();
});

module.exports = uploadImage;
