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
}


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
    title, desc, img, user
  });

  try {
    await blog.save();
  } catch (e) {
    return console.log(e);
  }

  return res.status(200).json({ blog });
}

const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, desc } = req.body;
  let blog;

  try {
    blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(500).json({ message: "Unable to update" })
    }

    blog.title = title;
    blog.desc = desc;

    await blog.save();

  } catch (e) {
    return console.log(e);
  }

  return res.status(200).json({ blog });
}

const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;

  try {
    blog = await Blog.findById(id);
  }
  catch (e) {
    return console.log(e);
  }

  if (!blog) {
    return res.status(500).json({ message: "not found" });
  }

  return res.status(200).json({ blog });
}

const deleteBlog = async (req, res, next) => {

  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id)
  } catch (e) {
    console.log(e);
  }
  if (!blog) {
    return res.status(500).json({ message: "unable to delete" })
  }
  return res.status(200).json({ message: "successfuly deleted" })
}

const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    return console.log(err);
  }


  try {
    userBlogs = await Blog.find({ user: userId });
  } catch (err) {
    return console.log(err);
  }

  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }

  return res.status(200).json({ user: userBlogs });
};

module.exports = { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getByUserId };
