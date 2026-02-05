const { User } = require("../models");

const searchUsers = async (query) => {
  return User.find({
    isDeleted: false,
    isVerified: true,
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } }
    ]
  }).select("_id name email");
};

module.exports = {
  searchUsers
};
