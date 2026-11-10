const asyncHandler = require("express-async-handler");

const paginationHelper = asyncHandler(async (req, res, next, model) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {};

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  const documentsNumber = await model.countDocuments();

  if (endIndex < documentsNumber) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  return { pagination, limit, skip };
});

module.exports = paginationHelper;
