const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signinForgetPassword,
} = require("../controllers/auth.controller");
///api/auth/
router.post("/register", signup);
router.post("/login", signin);
router.put("/forget", signinForgetPassword);

module.exports = router;
