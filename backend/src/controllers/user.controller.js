const User = require("../models/user.model");

module.exports.addAddress = async (req, res) => {
  const { userId } = req.params;
  const { line1, line2, zipcode, city, state, country } = req.body;

  try {
    if (!line1 || !city || !zipcode) {
      return res
        .status(400)
        .json({ message: "Please provide line1, city, and zipcode" });
    }

    const newAddress = {
      line1,
      line2,
      zipcode,
      city,
      state,
      country,
    };

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(newAddress);
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Address added successfully", user: updatedUser });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ error: "An error occurred while adding address" });
  }
};

module.exports.removeAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  console.log(addressId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.addresses.some(
      (address) => address._id === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.splice(addressIndex, 1);
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Address removed successfully", user: updatedUser });
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ error: "An error occurred while removing address" });
  }
};
