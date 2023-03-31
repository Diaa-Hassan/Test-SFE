const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", userController.signup);
router.delete("/:id", userController.deleteUser);

module.exports = router;
