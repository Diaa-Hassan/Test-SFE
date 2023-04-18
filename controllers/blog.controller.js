const mongoose = require("mongoose");
const Blog = require("../models/blog.model");
const User = require("../models/user.model");

const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (e) {
    console.log(e);
  }

  if (!blogs) {
    return res.status(404).json({ message: " No blogs found" });
  }

  return res.status(200).json({ blogs });
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;

  try {
    blog = await Blog.findById(id);
  } catch (e) {
    return console.log(e);
  }

  if (!blog) {
    return res.status(500).json({ message: "not found" });
  }

  return res.status(200).json({ blog });
};

const addBlog = async (req, res, next) => {
  const { title, desc, img, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ id: user });
  } catch (e) {
    return console.log(e);
  }
  if (!existingUser) {
    return res.status(400).json({ message: " Unautorized" });
  }
  const blog = new Blog({
    title,
    desc,
    img,
    user,
  });

  try {
    await blog.save();
  } catch (e) {
    return console.log(e);
  }

  return res.status(200).json({ blog });
};

module.exports = {
  getAllBlogs,
  addBlog,
  updateBlog,
  getById,
  deleteBlog,
  getByUserId,
};
