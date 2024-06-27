const Product = require("../models/product.model");
const User = require("../models/user.model");
const stripe = require("stripe")(
  "sk_test_51PF8zNSJlt5r6K6i478Te0Q0eg8gzaCRAGzMk6UEY7o2dhBUyW5VNb5TJ55qRQhTei6FWAVjFu6Sa7lA4j1PWdOU00iGQa09Jq"
);
module.exports.addProduct = async (req, res) => {
  const { title, cost } = req.body;

  try {
    if (title == "" || cost == "" || !title || !cost) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded" });
    }

    const filePaths = [];

    // Iterate over each file in req.files and push its path to filePaths
    Object.values(req.files).forEach((fileArray) => {
      fileArray.forEach((file) => {
        filePaths.push(file.path);
      });
    });

    const product = await Product.create({
      ...req.body,
      productImage: filePaths,
    });
    res.status(201).json({ product });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "something went wrong !" });
  }
};

const DEFAULT_PAGE_SIZE = 10;

module.exports.listAdminProduct = async (req, res) => {
  try {
    const { userId } = req.params;
    let { page, pageSize } = req.query;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || DEFAULT_PAGE_SIZE;

    const skip = (page - 1) * pageSize;

    const totalCount = await Product.countDocuments({ userId });

    const totalPages = Math.ceil(totalCount / pageSize);

    const products = await Product.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({ products, totalPages, currentPage: page, totalCount });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ error: "An error occurred while listing products" });
  }
};

module.exports.listProduct = async (req, res) => {
  try {
    let { page, pageSize } = req.query;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || DEFAULT_PAGE_SIZE;

    const skip = (page - 1) * pageSize;

    const totalCount = await Product.countDocuments();

    const totalPages = Math.ceil(totalCount / pageSize);

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({ products, totalPages, currentPage: page, totalCount });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ error: "An error occurred while listing products" });
  }
};

module.exports.updateProduct = async (req, res) => {
  console.log(req.files);
  const { productId } = req.params;
  const updatedFields = {};

  try {
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.files) {
      const newImageURLs = [];

      Object.values(req.files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          newImageURLs.push(file.path);
        });
      });

      updatedFields.productImage = [
        ...existingProduct.productImage,
        ...newImageURLs,
      ];
    }

    Object.keys(req.body).forEach((key) => {
      if (key !== "productImage") {
        updatedFields[key] = req.body[key];
      }
    });

    const product = await Product.findByIdAndUpdate(productId, updatedFields, {
      new: true,
    });

    res.status(200).json({ product, message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "product deleted !" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.listProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    res.status(200).json({ product });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.addToCart = async (req, res) => {
  const { userId } = req.params;
  const { title, price, quantity, productId, productImage } = req.body;

  try {
    if (!title || !price || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the product already exists in the cart
    const productExists = user.addToCartProducts.some(
      (product) => product.productId === productId
    );

    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product already exists in cart" });
    }

    // If the product does not exist, add it to the cart
    user.addToCartProducts.push({
      title,
      price,
      quantity,
      productId,
      productImage,
    });

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.removeFromCart = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const index = user.addToCartProducts.findIndex(
      (product) => product.productId === productId
    );

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    user.addToCartProducts.splice(index, 1);

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      payload: updatedUser,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.createReview = async (req, res) => {
  console.log(req.body);
  try {
    const { rating, comment, productId, userId, userName } = req.body;

    const review = {
      user: userId,
      name: userName,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === userId.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    const reviewProduct = await product.save();

    res.status(200).json({ success: true, reviewProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error during creating review !" });
  }
};

module.exports.deleteReview = async (req, res) => {
  const user = await User.findById(req.query.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!user === "admin") {
    return res
      .status(401)
      .json({ success: false, message: "You are not allowed" });
  }

  const product = await Product.findById(req.query.productId);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings: Number(ratings),
    numOfReviews,
  });
  res.status(200).json({ success: true, reviews });
};

//stripe for payments

module.exports.checkoutProduct = async (req, res) => {
  try {
    // indian test card number 4000003560000008

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
          },
          unit_amount: item.cost * 100,
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during checkout." });
  }
};

//new way

module.exports.addProductUser = async (req, res) => {
  const { title, cost, userId } = req.body;
  const user = await User.findById(userId);
  user.tasks.push({ title, cost });
  await user.save();
  res.status(201).json({ message: "Task added successfully" });
};
