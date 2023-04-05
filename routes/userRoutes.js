const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/update/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.getUser);

module.exports = router;
