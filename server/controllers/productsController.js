const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const productsModel = require("../models/ProductsModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const DiscountsModel = require("../models/DiscountsModel");
const { cloudinaryDelete } = require("../utils/cloudinary");
const { escapeRegex, getPagination } = require("../utils/security");

/**
 * @desc Get all products
 * @route GET /api/v1/products
 * @access public
 */

const getAllProducts = asyncHandler(async (req, res, next) => {
  const { search, category, manufactory, price, sort, all } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.title = {
      $regex: escapeRegex(String(search).slice(0, 100)),
      $options: "i",
    };
  }

  if (price) {
    const priceList = String(price).split("-");
    const minPrice = Number(priceList[0]);
    const maxPrice = Number(priceList[1]);

    if (Number.isFinite(minPrice) && Number.isFinite(maxPrice)) {
      queryObject.price = {
        $gte: Math.max(minPrice, 0),
        $lte: Math.max(maxPrice, 0),
      };
    }
  }

  if (category) {
    validateMongoId(category);
    queryObject.categoryId = category;
  }

  if (manufactory) {
    validateMongoId(manufactory);
    queryObject.manufactoryId = manufactory;
  }

  let result = productsModel
    .find(queryObject)
    .populate("categoryId", "title description");

  const allowedSortFields = new Set(["title", "price", "quantity", "createdAt"]);
  const [sortBy, direction] = sort ? String(sort).split(".") : [];
  const hasValidSort = allowedSortFields.has(sortBy);

  if (hasValidSort) {
    result = result.sort({ [sortBy]: direction === "asc" ? 1 : -1 });
  }

  const { page, limit, skip } = getPagination(req.query, 10, 100);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {};

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  const documentsNumber = await productsModel.countDocuments(queryObject);

  if (endIndex < documentsNumber) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  const lastPage = Math.ceil(documentsNumber / limit);

  if (page <= lastPage) {
    pagination.current = {
      page,
      limit,
    };
  }

  pagination.totalPages = lastPage;

  if (all === "true") {
    result = hasValidSort
      ? result.limit(500)
      : result.limit(500).sort({ createdAt: -1 });
  } else {
    result = hasValidSort
      ? result.skip(skip).limit(limit)
      : result.skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  const products = await result;

  const minAndMaxPrice = await productsModel.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  const currentDate = new Date();

  const discounts = await DiscountsModel.find({
    applicableProducts: { $in: products.map((product) => product._id) },
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  })
    .select("_id name amount startDate endDate applicableProducts")
    .lean();

  const discountByProduct = new Map();

  for (const discount of discounts) {
    for (const productId of discount.applicableProducts) {
      const key = String(productId);
      const current = discountByProduct.get(key);

      if (!current || Number(discount.amount) > Number(current.amount)) {
        discountByProduct.set(key, discount);
      }
    }
  }

  const productsWithDiscounts = products.map((product) => {
    const categoryInfo = product._doc.categoryId;
    const categoryId = categoryInfo?._id ?? categoryInfo ?? null;
    const discount = discountByProduct.get(String(product._id));

    const productObject = {
      ...product._doc,
      categoryId,
      categoryInfo,
    };

    if (discount) {
      productObject.newPrice =
        Math.round(
          (product._doc.price -
            (product._doc.price * Number(discount.amount)) / 100) *
            100,
        ) / 100;
      productObject.discountInfo = {
        _id: discount._id,
        name: discount.name,
        amount: discount.amount,
        startDate: discount.startDate,
        endDate: discount.endDate,
      };
    }

    return productObject;
  });

  res.status(200).json({
    success: true,
    status: 200,
    data: productsWithDiscounts,
    pagination,
    totalFound: products.length,
    totalProducts: documentsNumber,
    priceSettings: {
      min: minAndMaxPrice[0]?.minPrice,
      max: minAndMaxPrice[0]?.maxPrice,
    },
  });
});

const offers = asyncHandler(async (req, res, next) => {
  const { sort, limit } = req.query;

  const currentDate = new Date();

  let discountsOfTheDayAggregation = [
    {
      $match: {
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "applicableProducts",
        foreignField: "_id",
        as: "applicableProducts",
      },
    },
    {
      $unwind: "$applicableProducts",
    },
    {
      $lookup: {
        from: "categories",
        localField: "applicableProducts.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        product: {
          $mergeObjects: [
            "$applicableProducts",
            {
              categoryInfo: { $arrayElemAt: ["$category", 0] },
            },
            {
              discountInfo: {
                _id: "$_id",
                name: "$name",
                amount: "$amount",
                startDate: "$startDate",
                endDate: "$endDate",
                newPrice: {
                  $subtract: [
                    "$applicableProducts.price",
                    {
                      $multiply: [
                        "$applicableProducts.price",
                        { $divide: ["$amount", 100] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    {
      $replaceRoot: { newRoot: "$product" },
    },
  ];

  const offerSortFields = new Set(["title", "price", "createdAt"]);
  const [sortBy, direction] = sort ? String(sort).split(".") : [];

  if (offerSortFields.has(sortBy)) {
    const sortPosition = direction === "asc" ? 1 : -1;
    discountsOfTheDayAggregation.push({ $sort: { [sortBy]: sortPosition } });
  }

  const numericLimit = Number(limit);
  if (Number.isFinite(numericLimit) && numericLimit > 0) {
    discountsOfTheDayAggregation.push({
      $limit: Math.min(Math.floor(numericLimit), 100),
    });
  }

  const discountsOfTheDay = await DiscountsModel.aggregate(
    discountsOfTheDayAggregation,
  );

  return res.status(200).json({
    success: true,
    status: 200,
    data: discountsOfTheDay,
    total: discountsOfTheDay.length,
  });
});

/**
 * @desc Get Single Product
 * @route /api/v1/products/:id
 * @method GET
 * @access public
 */

const getProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  validateMongoId(productId);

  let product = await productsModel.findById(productId);

  if (!product) {
    throw new CustomError("resource not found", 404);
  }

  const currentDate = new Date();

  const productWithDiscountInfo = await DiscountsModel.find({
    applicableProducts: { $in: [product._id] },
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  })
    .sort({ amount: -1 })
    .select("_id name amount startDate endDate");

  if (productWithDiscountInfo.length > 0) {
    const discount = productWithDiscountInfo[0];
    product = {
      ...product._doc,
      newPrice:
        Math.round(
          (product._doc.price -
            (product._doc.price * Number(discount.amount)) / 100) *
            100,
        ) / 100,
      discountInfo: discount,
    };
  }

  res.status(200).json({ success: true, status: 200, data: product });
});

/**
 * @desc Create Product
 * @route /api/v1/products
 * @method POST
 * @access private (admin only)
 */

const createProduct = asyncHandler(async (req, res, next) => {
  const productDetails = req.body;

  const product = await productsModel.create(productDetails);

  res.status(201).json({ success: true, status: 201, data: product });
});

/**
 * @desc Update Product
 * @route /api/v1/products/:id
 * @method PUT
 * @access private (admin only)
 */

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  validateMongoId(productId);

  const productInfo = req.body;

  const product = await productsModel.findById(productId);

  if (!product) {
    throw new CustomError("resource not found", 404);
  }

  const productUpdated = await productsModel.findByIdAndUpdate(
    productId,
    { $set: productInfo },
    { new: true, runValidators: true },
  );

  return res
    .status(200)
    .json({ success: true, status: 200, data: productUpdated });
});

/**
 * @desc Delete Product
 * @route /api/v1/products/:id
 * @method DELETE
 * @access private (admin only)
 */

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  validateMongoId(productId);

  // Get Product Info
  const product = await productsModel.findById(productId);

  // Check if product exist
  if (!product) {
    throw new CustomError("resource not found", 404);
  }

  if (product.image?.publicId) {
    await cloudinaryDelete(product.image.publicId);
  }

  await productsModel.findByIdAndDelete(productId);

  return res.status(200).json({ success: true, status: 200 });
});

/**
 * @desc Upload Product Image
 * @route /api/v1/products/:id/upload
 * @method PUT
 * @access private (admin only)
 */

const uploadProductImage = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  validateMongoId(productId);

  const product = await productsModel.findById(productId);

  if (!product) {
    throw new CustomError("resource not found", 404);
  }

  const photoPublicId = product?.image?.publicId;

  if (!req.fileUploadedInfo?.publicId || !req.fileUploadedInfo?.url) {
    throw new CustomError("Image upload failed", 500);
  }

  const { publicId, url } = req.fileUploadedInfo;

  const productModified = await productsModel.findByIdAndUpdate(
    productId,
    { image: { publicId, url } },
    { new: true },
  );

  if (photoPublicId) {
    await cloudinaryDelete(photoPublicId).catch((error) => {
      console.error("Failed to delete the previous product image:", error.message);
    });
  }

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Image uploaded successfully",
    data: productModified,
  });
});

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  offers,
  uploadProductImage,
};
