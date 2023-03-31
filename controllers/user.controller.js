const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/user.model");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const usernamecheck = await User.findOne({ username: username });
    if (usernamecheck) {
      return res.json({ msg: "Username is already used.", status: false });
    }

    const emailcheck = await User.findOne({ email: email });
    if (emailcheck) {
      return res.json({ msg: "Email is already used.", status: false });
    }

    const id = crypto.randomBytes(2).toString("hex");

    const user = await User.create({ id, username, email, password });
    await user.save();

    const obj = JSON.stringify(user);
    const jsonData = JSON.parse(obj);

    return res.status(200).json("User Created Successfully");
  } catch (ex) {
    next(ex);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json("Please provide id");
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(400).json("User not found");
    }

    await user.deleteOne();

    return res.status(200).json("User Deleted Successfully");
  } catch (ex) {
    next(ex);
  }
};

module.exports = {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
};
