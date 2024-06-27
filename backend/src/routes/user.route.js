const express = require("express");
const router = express.Router();
const { addAddress, removeAddress } = require("../controllers/user.controller");

router.post("/addAddress/:userId", addAddress);
router.post("/removeAddress/:userId/:addressId", removeAddress);

module.exports = router;
