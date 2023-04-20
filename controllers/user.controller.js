const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/user.model");

const sendEmail = require('../config/sendEmails')

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

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json("Please provide username and password");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json("Invalid Password");
    }

    return res.status(200).json("Login Successful");
  } catch (ex) {
    next(ex);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json("Please provide id");
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(400).json("User not found");
    }

    return res.status(200).json(user);
  } catch (ex) {
    next(ex);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!id) {
      return res.status(400).json("Please provide id");
    }
    if (!username || !email) {
      return res.status(400).json("Please provide all fields");
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(400).json("User not found");
    }

    user.username = username;
    user.email = email;
    await user.save();

    return res.status(200).json("User Updated Successfully");
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

const forgetPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({status:false , msg: "No email could not be sent" });
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `https://localhost:7000/api/user/resetpassword/${resetToken}`;

    // HTML Message
    const message = `
    <h3>Hi ${user.username},</h3><h4>Someone (hopefully you) has requested a password reset for your Blog account. Follow the link below to set a new password:</h4>
    <table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 15px;" bgcolor="#4178f9" height=50px><a href="${resetUrl}" clicktracking=off style="padding: 8px 12px;width:250px;text-align:center; border: 1px solid #39780;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
    Click To Reset Your Password</a></td></tr></table></td></tr></table>
    <h4>If you don't wish to reset your password, disregard this email and no action will be taken.</h4><h4>Blog Team.</h4>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Blog Password Reset Request",
        text: message,
      });

      res.json({ status: true,  msg : 'Email sent successfully' , token: resetToken});//
    } catch (err) {
      //next(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.json({status : false , msg: "Email could not be sent" });//
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  // Compare token in URL params to hashed token

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");


  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({  status: false, msg: "Invalid Token" });
    }


    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

 

    const resetUrl = `https://localhost:7000/login`;

    // HTML Message
    const message = `
    <h3>Hi ${user.username},</h3><h4>You are receving this email because your password has successfully been changed</h4>
    <table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 15px;" bgcolor="#4178f9" height=50px><a href="${resetUrl}" clicktracking=off style="padding: 8px 12px;width:250px;text-align:center; border: 1px solid #39780;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 17px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
    Click To Go To Login Page</a></td></tr></table></td></tr></table>
    <h4>Blog Team.</h4>
    `;

    try {
      sendEmail({
        to: user.email,
        subject: "Blog Password Reset confirmation",
        text: message,
      });

     
    } catch (err) {
     next(err)
    }
    await user.save();
    delete user.password;

    res.json({
      status: true,
      msg: "Password Updated Successfully"

    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
  forgetPassword,
  resetPassword
};
