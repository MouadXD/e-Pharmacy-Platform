const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUpload,
      { resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }

        return resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      },
    );
  });
};

const cloudinaryDelete = async (imagePublicId) => {
  if (!imagePublicId) {
    return null;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imagePublicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = { cloudinaryUpload, cloudinaryDelete };
