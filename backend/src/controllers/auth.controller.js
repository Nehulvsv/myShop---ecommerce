const Users = require("../models/user.model.js");
const bcryptjs = require("bcrypt");

module.exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    email == "" ||
    username == "" ||
    password == "" ||
    !email ||
    !username ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Enter a unique username" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Enter a new email" });
      }
    }

    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new Users({ username, email, password: hashPassword });

    await newUser.save();
    res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};

module.exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (email == "" || password == "" || !email || !password) {
    return res.status(400).json({ message: "All filed Required" });
  }
  const validUser = await Users.findOne({ email });
  if (!validUser) {
    return res.status(400).json({ message: "User not found" });
  }
  try {
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "password not match" });
    }
    res.status(200).json(validUser._doc);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "error" });
  }
};

module.exports.signinForgetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const validUser = await Users.findOne({ email });
    if (!validUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    try {
      await Users.findOneAndUpdate(
        { email },
        { password: hashPassword },
        { new: true }
      );
      res.status(200).json({ message: "New password created" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error updating password" });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error finding user" });
  }
};
