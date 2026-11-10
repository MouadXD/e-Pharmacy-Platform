const express = require("express");

const postsRoutes = express.Router();

const { getAllPosts, getPost } = require("../controllers/postsController");

postsRoutes.get("/posts", getAllPosts);
postsRoutes.get("/posts/:id", getPost);

module.exports = postsRoutes;
