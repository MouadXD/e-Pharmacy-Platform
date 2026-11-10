const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const AdsModel = require("../models/advertisementMode");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const { cloudinaryDelete } = require("../utils/cloudinary");
const { getPagination } = require("../utils/security");

/**
 * @desc Get active advertisements
 * @route GET /api/v1/ads
 * @access public
 */
const getAds = asyncHandler(async (req, res) => {
  const { valid } = req.query;
  const { page, limit, skip } = getPagination(req.query, 100, 100);

  const query = {};

  if (valid === "1" || valid === "true") {
    const currentDate = new Date();
    query.startDate = { $lte: currentDate };
    query.endDate = { $gte: currentDate };
  }

  const [ads, total] = await Promise.all([
    AdsModel.find(query)
      .sort({ priority: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AdsModel.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    status: 200,
    data: ads,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc Create an advertisement
 * @route POST /api/v1/ads
 * @access private (admin only)
 */
const createAds = asyncHandler(async (req, res) => {
  const lastPriorityAds = await AdsModel.find()
    .sort({ priority: -1 })
    .limit(1);

  const lastPriority = lastPriorityAds[0]?.priority;
  const priority = Number.isFinite(lastPriority) ? lastPriority + 1 : 1;

  const ads = await AdsModel.create({ ...req.body, priority });

  return res.status(201).json({ success: true, status: 201, data: ads });
});

/**
 * @desc Upload an advertisement image
 * @route PUT /api/v1/ads/:id/upload
 * @access private (admin only)
 */
const uploadAdsImage = asyncHandler(async (req, res) => {
  const { id: adsId } = req.params;
  validateMongoId(adsId);

  const ads = await AdsModel.findById(adsId);

  if (!ads) {
    throw new CustomError("Advertisement not found", 404);
  }

  if (!req.fileUploadedInfo?.publicId || !req.fileUploadedInfo?.url) {
    throw new CustomError("Image upload failed", 500);
  }

  const { publicId, url } = req.fileUploadedInfo;

  const adsModified = await AdsModel.findByIdAndUpdate(
    adsId,
    { image: { publicId, url } },
    { new: true },
  );

  if (ads.image?.publicId) {
    await cloudinaryDelete(ads.image.publicId).catch((error) => {
      console.error(
        "Failed to delete the previous advertisement image:",
        error.message,
      );
    });
  }

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Image uploaded successfully",
    data: adsModified,
  });
});

/**
 * @desc Delete an advertisement
 * @route DELETE /api/v1/ads/:id
 * @access private (admin only)
 */
const deleteAds = asyncHandler(async (req, res) => {
  const { id: adId } = req.params;
  validateMongoId(adId);

  const ad = await AdsModel.findById(adId);

  if (!ad) {
    throw new CustomError("Advertisement not found", 404);
  }

  if (ad.image?.publicId) {
    await cloudinaryDelete(ad.image.publicId);
  }

  await AdsModel.findByIdAndDelete(adId);

  return res.status(200).json({ success: true, status: 200 });
});

/**
 * @desc Update an advertisement
 * @route PUT /api/v1/ads/:id
 * @access private (admin only)
 */
const updateAds = asyncHandler(async (req, res) => {
  const { id: adId } = req.params;
  validateMongoId(adId);

  const ad = await AdsModel.findById(adId);

  if (!ad) {
    throw new CustomError("Advertisement not found", 404);
  }

  const startDate = req.body.startDate ?? ad.startDate;
  const endDate = req.body.endDate ?? ad.endDate;

  if (new Date(endDate) < new Date(startDate)) {
    throw new CustomError("End date must be after start date", 400);
  }

  const newAd = await AdsModel.findByIdAndUpdate(
    adId,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  return res.status(200).json({ success: true, status: 200, data: newAd });
});

module.exports = { getAds, createAds, uploadAdsImage, updateAds, deleteAds };
