const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const CouponsModel = require("../models/CouponsModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const { escapeRegex, getPagination } = require("../utils/security");

/**
 * @desc Get all coupons
 * @route GET /api/v1/coupons
 * @access private (admin only)
 */
const getAllCoupons = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const { page, limit, skip } = getPagination(req.query, 10, 100);

  const queryObject = {};

  if (search) {
    queryObject.code = {
      $regex: escapeRegex(String(search).slice(0, 50)),
      $options: "i",
    };
  }

  const [coupons, totalDocuments] = await Promise.all([
    CouponsModel.find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    CouponsModel.countDocuments(queryObject),
  ]);

  return res.status(200).json({
    success: true,
    status: 200,
    data: coupons,
    total: totalDocuments,
    page,
    limit,
    totalPages: Math.ceil(totalDocuments / limit),
  });
});

/**
 * @desc Get a single coupon
 * @route GET /api/v1/coupons/:id
 * @access private (admin only)
 */
const getCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  validateMongoId(couponId);

  const coupon = await CouponsModel.findById(couponId);

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  return res.status(200).json({ success: true, status: 200, coupon });
});

/**
 * @desc Create a coupon
 * @route POST /api/v1/coupons
 * @access private (admin only)
 */
const createCoupon = asyncHandler(async (req, res) => {
  const couponDetails = {
    ...req.body,
    code: req.body.code.trim().toUpperCase(),
  };

  const couponSearched = await CouponsModel.findOne({
    code: couponDetails.code,
  });

  if (couponSearched) {
    throw new CustomError("Coupon already exists", 409);
  }

  const coupon = await CouponsModel.create(couponDetails);

  return res.status(201).json({ success: true, status: 201, coupon });
});

/**
 * @desc Update a coupon
 * @route PUT /api/v1/coupons/:id
 * @access private (admin only)
 */
const updateCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  validateMongoId(couponId);

  const existingCoupon = await CouponsModel.findById(couponId);

  if (!existingCoupon) {
    throw new CustomError("Coupon not found", 404);
  }

  const updates = { ...req.body };
  if (updates.code) {
    updates.code = updates.code.trim().toUpperCase();
  }

  const startDate = updates.startDate ?? existingCoupon.startDate;
  const endDate = updates.endDate ?? existingCoupon.endDate;

  if (new Date(endDate) < new Date(startDate)) {
    throw new CustomError("End date must be after start date", 400);
  }

  const coupon = await CouponsModel.findByIdAndUpdate(
    couponId,
    { $set: updates },
    { new: true, runValidators: true },
  );

  return res.status(200).json({ success: true, status: 200, coupon });
});

/**
 * @desc Delete a coupon
 * @route DELETE /api/v1/coupons/:id
 * @access private (admin only)
 */
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  validateMongoId(couponId);

  const coupon = await CouponsModel.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  return res.status(200).json({ success: true, status: 200 });
});

/**
 * @desc Validate a coupon for the cart
 * @route POST /api/v1/checkCoupon
 * @access public (rate-limited)
 */
const checkCouponCode = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;
  const now = new Date();

  const coupon = await CouponsModel.findOne({
    code: couponCode.trim().toUpperCase(),
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $expr: { $lt: ["$usedCount", "$usageLimit"] },
  });

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  const couponInfo = {
    code: coupon.code,
    discountValue: coupon.discountValue,
    endDate: coupon.endDate,
    minimumPurchase: coupon.minimumPurchase,
    maxDiscount: coupon.maxDiscount,
  };

  return res.status(200).json({ success: true, status: 200, data: couponInfo });
});

module.exports = {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  checkCouponCode,
};
