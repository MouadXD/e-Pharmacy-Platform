const express = require("express");

const userRoutes = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const isCurrentUser = require("../middlewares/isCurrentUser");

const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const validateRequest = require("../middlewares/validateRequest");
const { updateUserSchema } = require("../helpers/requestValidationSchemas");

userRoutes.get("/user/:id", requireAuth, isCurrentUser, getUser);
userRoutes.put(
  "/user/:id",
  requireAuth,
  isCurrentUser,
  validateRequest(updateUserSchema),
  updateUser,
);
userRoutes.delete("/user/:id", requireAuth, isCurrentUser, deleteUser);

module.exports = userRoutes;
