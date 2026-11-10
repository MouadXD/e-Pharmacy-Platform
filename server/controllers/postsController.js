const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const PostsModel = require("../models/PostsMode");
const { validateMongoId } = require("../helpers/requestValidationSchemas");

/**
 * @desc Get All Posts
 * @route /api/v1/posts
 * @method GET
 * @access public
 */

const getAllPosts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const numericLimit = Number(limit);
  const resultLimit =
    Number.isFinite(numericLimit) && numericLimit > 0
      ? Math.min(Math.floor(numericLimit), 100)
      : 100;

  const allPosts = await PostsModel.find({})
    .select("-adminId")
    .sort({ createdAt: -1 })
    .limit(resultLimit);

  res.status(200).json({ success: true, data: allPosts, status: 200 });
});

/**
 * @desc Get Single Post
 * @route /api/v1/posts/:id
 * @method GET
 * @access public
 */

const getPost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;

  validateMongoId(postId);

  const post = await PostsModel.findById(postId).select("-adminId");

  if (!post) {
    throw new CustomError("resource not found", 404);
  }

  res.status(200).json({ success: true, data: post, status: 200 });
});

module.exports = {
  getAllPosts,
  getPost,
};
