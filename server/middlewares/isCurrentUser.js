const CustomError = require("../utils/customError");
const { validateMongoId } = require("../helpers/requestValidationSchemas");

const isCurrentUser = (req, res, next) => {
  const userId = req.user;
  const userIdAction = req.params.id;

  if (!userIdAction || !validateMongoId(userIdAction, false)) {
    return next(new CustomError("Invalid user id", 400));
  }

  if (String(userId) !== String(userIdAction)) {
    return next(new CustomError("Forbidden", 403));
  }

  next();
};

module.exports = isCurrentUser;
