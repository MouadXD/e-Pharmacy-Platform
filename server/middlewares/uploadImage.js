const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CustomError = require("../utils/customError");

const uploadDirectory = path.resolve(__dirname, "../upload");
fs.mkdirSync(uploadDirectory, { recursive: true });

const safeFieldName = /^[a-zA-Z0-9_-]+$/;

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, uploadDirectory);
  },
  filename: (req, file, callBack) => {
    if (
      typeof file.fieldname !== "string" ||
      !safeFieldName.test(file.fieldname)
    ) {
      return callBack(new CustomError("Invalid upload filename", 400));
    }

    callBack(
      null,
      `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`,
    );
  },
});

const filter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  return cb(new Error("Only image files are allowed"));
};

const upload = multer({
  storage,
  fileFilter: filter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

module.exports = upload;
