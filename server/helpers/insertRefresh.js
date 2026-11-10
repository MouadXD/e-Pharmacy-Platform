const UserModel = require("../models/UsersModel");
const { hashToken } = require("../utils/security");

const insertRefresh = async (id, refreshToken) => {
  return UserModel.updateOne(
    { _id: id },
    { $set: { refreshToken: hashToken(refreshToken) } },
  );
};

module.exports = insertRefresh;
