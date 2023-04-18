const express = require("express")
const blogRouter = express.Router();

const { getAllBlogs, addBlog,
  updateBlog, getById,
  deleteBlog, getByUserId } = require("../controllers/blog.controller");

blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getById);

module.exports = blogRouter;