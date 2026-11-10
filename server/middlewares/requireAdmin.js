const CustomError = require("../utils/customError");

const requireAdmin = (req, res, next) => {
  if (!req.user || req.userRole !== "admin") {
    return next(new CustomError("Forbidden", 403));
  }

  next();
};

module.exports = requireAdmin;
