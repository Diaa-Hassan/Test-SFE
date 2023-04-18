const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  }
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;