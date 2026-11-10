const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UsersModel");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Unauthorized", 401);
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!process.env.ACCESS_TOKEN_SECRET || !token) {
      throw new CustomError("Unauthorized", 401);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"],
      issuer: "online-pharmacy",
      audience: "online-pharmacy-client",
    });

    if (decoded.type !== "access") {
      throw new CustomError("Unauthorized", 401);
    }

    const user = await UserModel.findById(decoded.id).select(
      "_id role isBlocked tokenVersion",
    );

    if (
      !user ||
      user.isBlocked ||
      Number(decoded.tokenVersion || 0) !== Number(user.tokenVersion || 0)
    ) {
      throw new CustomError("Unauthorized", 401);
    }

    req.user = user._id.toString();
    req.userRole = user.role;
    req.userDoc = user;
    next();
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Unauthorized", 401),
    );
  }
};

module.exports = requireAuth;
