const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const {
  addProduct,
  listProduct,
  updateProduct,
  deleteProduct,
  listProductById,
  addProductUser,
  checkoutProduct,
  addToCart,
  removeFromCart,
  listAdminProduct,
  createReview,
  deleteReview,
} = require("../controllers/product.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/addproduct/:userId",
  upload.fields([
    { name: "productImage0", maxCount: 1 },
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
  ]),
  addProduct
);

router.post("/listadminproduct/:userId", listAdminProduct);
router.post("/listproduct", listProduct);
router.put(
  "/updateproduct/:productId",
  upload.fields([
    { name: "productImage0", maxCount: 1 },
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
  ]),
  updateProduct
);
router.post("/addtocart/:userId", upload.none(), addToCart);
router.post("/removetocart/:userId", removeFromCart);
router.delete("/deleteproduct/:productId", deleteProduct);
router.post("/listProductById/:productId", listProductById);
router.post("/checkout", checkoutProduct);
router.post("/review", upload.none(), createReview);
router.post("/admin/review", deleteReview);

// Store the product inside the user collection in the form of an array of objects
router.post("/addproductuser", addProductUser);

module.exports = router;
