const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  line1: String,
  line2: String,
  zipcode: String,
  city: String,
  state: String,
  country: String,
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    password: {
      type: String,
      required: true,
    },
    addToCartProducts: {
      type: Array,
    },
    role: {
      type: String,
      default: "user",
    },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
