const DiscountsModel = require("../models/DiscountsModel");

const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

const getActiveDiscountsForProducts = async (productIds, date = new Date()) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return new Map();
  }

  const discounts = await DiscountsModel.find({
    applicableProducts: { $in: productIds },
    startDate: { $lte: date },
    endDate: { $gte: date },
  }).select("applicableProducts amount");

  const discountPercentByProduct = new Map();

  for (const discount of discounts) {
    for (const productId of discount.applicableProducts) {
      const key = String(productId);
      const current = discountPercentByProduct.get(key) || 0;
      discountPercentByProduct.set(key, Math.max(current, discount.amount));
    }
  }

  return discountPercentByProduct;
};

const getEffectiveUnitPrice = (price, discountPercent = 0) => {
  const safePrice = Number(price) || 0;
  const safeDiscount = Math.min(Math.max(Number(discountPercent) || 0, 0), 100);
  return roundMoney(safePrice - (safePrice * safeDiscount) / 100);
};

module.exports = {
  roundMoney,
  getActiveDiscountsForProducts,
  getEffectiveUnitPrice,
};
