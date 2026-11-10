const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");

const mongoId = Joi.string()
  .trim()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .message("Invalid MongoDB id");

const validationMode = () =>
  process.env.NODE_ENV === "production"
    ? { recaptchaToken: Joi.string().trim().required() }
    : {};

const checkCouponSchema = Joi.object({
  couponCode: Joi.string().trim().uppercase().min(1).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).max(128).required(),
  ...validationMode(),
});

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: passwordComplexity().required(),
  ...validationMode(),
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  ...validationMode(),
});

const resetPasswordSchema = Joi.object({
  password: passwordComplexity().required(),
  confirmedPassword: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(1).max(128).required(),
  newPassword: passwordComplexity().required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100),
  lastName: Joi.string().trim().max(100).allow(""),
  gendre: Joi.string().valid("male", "female", "other", ""),
  phoneNumber: Joi.object({
    number: Joi.number().integer().min(0),
  }),
  birthdayDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null, ""),
  addresses: Joi.array().items(
    Joi.object({
      id: mongoId,
      title: Joi.string().trim().min(1).max(100).required(),
      fullName: Joi.string().trim().min(1).max(150).required(),
      phoneNumber: Joi.string().trim().min(6).max(30).required(),
      street: Joi.string().trim().max(200).required(),
      city: Joi.string().trim().max(100).required(),
      state: Joi.string().trim().max(100).required(),
      zipCode: Joi.string().trim().max(20).required(),
      country: Joi.string().trim().max(100).required(),
      isDefault: Joi.boolean(),
    }),
  ),
}).min(1);

const createAddressSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  fullName: Joi.string().trim().min(1).max(150).required(),
  phoneNumber: Joi.string().trim().min(6).max(30).required(),
  street: Joi.string().trim().max(200).required(),
  city: Joi.string().trim().max(100).required(),
  state: Joi.string().trim().max(100).required(),
  zipCode: Joi.string().trim().max(20).required(),
  country: Joi.string().trim().max(100).required(),
  isDefault: Joi.boolean().default(false),
});

const createCategorySchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(1000).allow(""),
});

const updateCategorySchema = Joi.object({
  title: Joi.string().trim().min(1).max(100),
  description: Joi.string().trim().max(1000).allow(""),
}).min(1);

const couponFields = {
  code: Joi.string().trim().uppercase().min(3).max(50),
  discountValue: Joi.number().min(0).max(100),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  minimumPurchase: Joi.number().min(0),
  maxDiscount: Joi.number().min(0).allow(null),
  usageLimit: Joi.number().integer().min(1),
  usedCount: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
};

const createCouponSchema = Joi.object({
  ...couponFields,
  code: couponFields.code.required(),
  discountValue: couponFields.discountValue.required(),
  startDate: couponFields.startDate.required(),
  endDate: couponFields.endDate.required().min(Joi.ref("startDate")),
});

const updateCouponSchema = Joi.object({
  ...couponFields,
  endDate: couponFields.endDate,
}).min(1);

const createManufactorySchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
});

const updateManufactorySchema = Joi.object({
  title: Joi.string().trim().min(1).max(100),
}).min(1);

const productDescriptionSchema = Joi.object({
  main: Joi.string().trim().min(1).max(5000).required(),
  benefits: Joi.array().items(Joi.string().trim().max(500)).min(1).required(),
  uses: Joi.array().items(Joi.string().trim().max(500)).min(1).required(),
  safetyInformations: Joi.array()
    .items(Joi.string().trim().max(500))
    .min(1)
    .required(),
});

const productFields = {
  title: Joi.string().trim().min(1).max(200),
  description: productDescriptionSchema,
  price: Joi.number().min(0),
  quantity: Joi.number().integer().min(0),
  prescripted: Joi.boolean(),
  categoryId: mongoId,
  expiredAt: Joi.date().iso().allow(null),
};

const createProductSchema = Joi.object({
  ...productFields,
  title: productFields.title.required(),
  description: productFields.description.required(),
  price: productFields.price.required(),
  quantity: productFields.quantity.required(),
  prescripted: productFields.prescripted.default(false),
  categoryId: productFields.categoryId.required(),
});

const updateProductSchema = Joi.object(productFields).min(1);

const createSupplierSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phoneNumber: Joi.number().integer().min(0).required(),
});

const updateSupplierSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150),
  email: Joi.string().trim().lowercase().email(),
  phoneNumber: Joi.number().integer().min(0),
}).min(1);

const createDiscountSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).required(),
  amount: Joi.number().min(0).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required().min(Joi.ref("startDate")),
  applicableProducts: Joi.array().items(mongoId).min(1).required(),
});

const updateDiscountSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150),
  amount: Joi.number().min(0).max(100),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  applicableProducts: Joi.array().items(mongoId).min(1),
}).min(1);

const createAdsSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required().min(Joi.ref("startDate")),
});

const updateAdsSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
}).min(1);

const validateMongoId = (id, throwOnInvalid = true) => {
  const isValid =
    typeof id === "string" &&
    mongoose.Types.ObjectId.isValid(id) &&
    /^[a-fA-F0-9]{24}$/.test(id);

  if (!isValid && throwOnInvalid) {
    throw new CustomError("Invalid id", 400);
  }

  return isValid;
};

module.exports = {
  loginSchema,
  registerSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  createAddressSchema,
  createCategorySchema,
  updateCategorySchema,
  createCouponSchema,
  updateCouponSchema,
  createManufactorySchema,
  updateManufactorySchema,
  createProductSchema,
  updateProductSchema,
  createSupplierSchema,
  updateSupplierSchema,
  createDiscountSchema,
  updateDiscountSchema,
  createAdsSchema,
  updateAdsSchema,
  changePasswordSchema,
  validateMongoId,
  checkCouponSchema,
};
