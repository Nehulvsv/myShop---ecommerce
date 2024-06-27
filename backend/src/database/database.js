const mongoose = require("mongoose");

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(
      // "mongodb+srv://nehulvasava15:lW7zABSWSRSJ3nKX@cluster0.s8ft71d.mongodb.net/"
      "mongodb+srv://nehulvasava15:2FPDZqbwSKj5QLeK@cluster0.un6i6gn.mongodb.net/"
    );
    console.log("db connected successfull!");
  } catch (e) {
    console.log(e);
  }
};
