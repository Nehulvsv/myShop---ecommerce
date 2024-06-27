const express = require("express");
const cors = require("cors");
const app = express();
const usersAuth = require("./src/routes/auth.route");
const userProduct = require("./src/routes/product.route");
const userUpdate = require("./src/routes/user.route");
const { connectDB } = require("./src/database/database");

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/auth", usersAuth);
app.use("/api/product", userProduct);
app.use("/api/user", userUpdate);
app.use("/uploads", express.static(__dirname + "/uploads"));

app.listen(8800, () => {
  console.log("server is running in port 8800 !");
});
