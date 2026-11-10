const asyncHandler = require("express-async-handler");
const productsModel = require("../models/ProductsModel");
const usersModel = require("../models/UsersModel");
const OrderModel = require("../models/ordersModel");

/**
 * @desc Get Statistics
 * @route /api/v1/statistics
 * @method GET
 * @access private (admin only)
 */

const getStatistics = asyncHandler(async (req, res, next) => {
  const productsNumber = await productsModel.countDocuments();
  const usersNumber = await usersModel.countDocuments();
  const expiredProducts = await productsModel
    .find({ expiredAt: { $lt: new Date() } })
    .select("_id title quantity expiredAt");

  const orderStatistics = await OrderModel.aggregate([
    {
      $match: {
        paymentStatus: "PAID",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalSales: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  // Calculate total revenue
  let totalRevenue = 0;
  orderStatistics.forEach((stat) => {
    totalRevenue += stat.totalSales;
  });

  res.status(200).json({
    success: true,
    statistics: {
      productsTotal: productsNumber,
      usersTotal: usersNumber,
      expiredProducts: {
        expiredProductsDetail: expiredProducts,
        total: expiredProducts.length,
      },
      orders: orderStatistics,
      revenue: totalRevenue, // Include total revenue in response
    },
  });
});

module.exports = getStatistics;
