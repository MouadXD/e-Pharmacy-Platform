const CustomError = require("../utils/customError");

const notFound = () => {
  throw new CustomError("Route not found", 404);
};

module.exports = notFound;
